import aioredis
from aiohttp.web import Application
from .utils.fields import get_fields, Fields
from .utils.db import create_redis_url


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
