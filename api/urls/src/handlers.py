import trafaret as t

from aiohttp import web
from aiohttp_jwt import login_required
from .queries import redis
from .utils.fields import Fields, get_user_id
from .utils.db import redis_pool
from .utils.expire import SHORT_URL_MIN_TTL, SHORT_URL_MAX_TTL
from .utils.json import fetch_long_url, fetch_url_expire_at
from .utils.expire import expire_date_to_ttl
from .utils.urls import create_short_url


async def handle_shortify_url(request: web.Request) -> web.Response:
    json = await request.json()
    long_url = fetch_long_url(json)
    expire_at = fetch_url_expire_at(json)
    ttl = expire_date_to_ttl(expire_at)
    print(expire_at, ttl)
    try:
        ttl = (t.Int(gte=SHORT_URL_MIN_TTL) & t.Int(lte=SHORT_URL_MAX_TTL)).check(ttl)
    except t.DataError:
        raise web.HTTPBadRequest(reason="Invalid expire date")
    user_id = get_user_id(request)
    pool = redis_pool(request)
    url_id = await redis.remember_long_url(pool, long_url, ttl, user_id)
    resp = {
        Fields.CREATED: create_short_url(url_id)
    }
    return web.json_response(resp, status=201)


async def handle_redirect(request: web.Request) -> web.Response:
    url_id = request.match_info['url_id']
    pool = redis_pool(request)
    long_url = await redis.get_long_url(pool, url_id)
    if long_url is None:
        raise web.HTTPNotFound(reason="No such URL")
    raise web.HTTPFound(location=long_url)


@login_required
async def handle_get_user_owned_urls(request: web.Request) -> web.Response:
    user_id = request["user"]["user_id"]
    print(user_id)
    pool = redis_pool(request)
    urls = await redis.get_urls_for_user(pool, user_id)
    return web.json_response(urls)
