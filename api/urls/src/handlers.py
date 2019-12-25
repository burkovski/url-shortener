from aiohttp import web
from .queries import redis
from .utils.fields import Fields, get_user_id
from .utils.db import redis_pool
from .utils.json import fetch_long_url, fetch_url_expire_at
from .utils.expire import expire_date_to_ttl


async def handle_shortify_url(request: web.Request) -> web.Response:
    json = await request.json()
    long_url = fetch_long_url(json)
    expire_at = fetch_url_expire_at(json)
    ttl = expire_date_to_ttl(expire_at)
    user_id = get_user_id(request)
    pool = redis_pool(request)
    url_id = await redis.remember_long_url(pool, long_url, ttl, user_id)
    resp = {
        Fields.URL_SHORT: url_id
    }
    return web.json_response(resp, status=201)


async def handle_redirect(request: web.Request) -> web.Response:
    url_id = request.match_info['url_id']
    pool = redis_pool(request)
    long_url = await redis.get_long_url(pool, url_id)
    if long_url is None:
        raise web.HTTPNotFound(reason="No such URL")
    return web.json_response({Fields.URL_LONG: long_url})


async def handle_get_user_owned_urls(request: web.Request) -> web.Response:
    user_id = request.match_info['user_id']
    pool = redis_pool(request)
    urls = await redis.get_urls_for_user(pool, user_id)
    return web.json_response(urls)
