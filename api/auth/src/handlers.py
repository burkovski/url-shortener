from aiohttp import web
from .queries import postgres, redis
from .utils.fields import Fields
from .utils.db import postgres_pool, redis_pool
from .utils import security
from .utils.json import fetch_email, fetch_password, fetch_token, fetch_ref_token
from asyncpg.exceptions import UniqueViolationError


async def handle_get_all_users(request: web.Request) -> web.Response:
    async with postgres_pool(request).acquire() as conn:
        users = await postgres.get_all_users(conn)
    users = list(map(dict, users))
    return web.json_response(users)


async def handle_create_user(request: web.Request) -> web.Response:
    json = await request.json()
    email, password = fetch_email(json), fetch_password(json)
    hashed_password = security.generate_password_hash(password)
    async with postgres_pool(request).acquire() as conn:
        try:
            await postgres.create_user(conn, email, hashed_password)
        except UniqueViolationError:
            raise web.HTTPBadRequest(reason=f"User with email {email} already exists")
    return web.json_response({Fields.CREATED: email}, status=201)


async def handle_create_token(request: web.Request) -> web.Response:
    json = await request.json()
    email = fetch_email(json)
    async with postgres_pool(request).acquire() as conn:
        user = await postgres.get_user_by_email(conn, email)
    if user is None:
        raise web.HTTPBadRequest(reason="No such user")
    real_password = user[Fields.PASSWORD]
    json_password = fetch_password(json)
    if not security.check_password_hash(json_password, real_password):
        raise web.HTTPBadRequest(reason="Invalid password")
    user_id = user[Fields.PG_ID]
    token = security.create_token(user_id)
    refresh_token = security.create_refresh_token()
    pool = redis_pool(request)
    await redis.remember_refresh_token(pool, refresh_token, user_id)
    resp_json = {
        Fields.CREATED: {
            Fields.TOKEN: token,
            Fields.REF_TOKEN: refresh_token
        }
    }
    return web.json_response(resp_json, status=201)


async def handle_refresh_token(request: web.Request) -> web.Response:
    json = await request.json()
    ref_token = fetch_ref_token(json)
    pool = redis_pool(request)
    user_id = await redis.get_user_id_by_ref_token(pool, ref_token)
    if user_id is None:
        raise web.HTTPBadRequest(reason="Refresh token is invalid or expired")
    new_token = security.create_token(user_id)
    new_ref_token = security.create_refresh_token()
    await redis.replace_refresh_token(pool, ref_token, new_ref_token, user_id)
    resp_json = {
        Fields.CREATED: {
            Fields.TOKEN: new_token,
            Fields.REF_TOKEN: new_ref_token
        }
    }
    return web.json_response(resp_json, status=201)
