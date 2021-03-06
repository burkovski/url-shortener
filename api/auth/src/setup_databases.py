import asyncpgsa
import aioredis

from aiohttp.web import Application
from .utils.fields import get_fields, Fields
from .utils.db import create_postgres_url, create_redis_url


async def init_postgres(app: Application):
    db_config = app["config"][Fields.POSTGRES]
    minsize, maxsize = get_fields(db_config, "minsize", "maxsize")
    db_url = create_postgres_url(db_config)
    pool = await asyncpgsa.create_pool(
        db_url,
        min_size=minsize,
        max_size=maxsize
    )
    app[Fields.POSTGRES] = pool
    yield
    await app[Fields.POSTGRES].close()


async def init_redis(app: Application):
    redis_config = app["config"][Fields.REDIS]
    minsize, maxsize = get_fields(redis_config, "minsize", "maxsize")
    redis_url = create_redis_url(redis_config)
    pool = await aioredis.create_redis_pool(
        redis_url,
        minsize=minsize,
        maxsize=maxsize,
        encoding="utf-8"
    )
    app[Fields.REDIS] = pool
    yield
    app[Fields.REDIS].close()
    await app[Fields.REDIS].wait_closed()
