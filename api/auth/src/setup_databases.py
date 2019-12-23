import asyncpgsa
import aioredis

from aiohttp.web import Application
from .utils.fields import get_fields
from .utils.db import create_postgres_url, create_redis_url


async def init_postgres(app: Application):
    db_config = app["config"]["postgres"]
    minsize, maxsize = get_fields(db_config, "minsize", "maxsize")
    db_url = create_postgres_url(db_config)
    pool = await asyncpgsa.create_pool(
        db_url,
        min_size=minsize,
        max_size=maxsize
    )
    app["postgres"] = pool
    yield
    await app["postgres"].close()


async def init_redis(app: Application):
    redis_config = app["config"]["redis"]
    minsize, maxsize, db = get_fields(redis_config, "minsize", "maxsize", "database")
    redis_url = create_redis_url(redis_config)
    pool = await aioredis.create_redis_pool(
        redis_url,
        db=db,
        minsize=minsize,
        maxsize=maxsize,
        encoding="utf-8"
    )
    app["redis"] = pool
    yield
    app["redis"].close()
    await app["redis"].wait_closed()
