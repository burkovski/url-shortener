from aioredis import MultiExecError
from trafaret import guard, Int
from ..utils.expire import SHORT_URL_MIN_TTL, SHORT_URL_MAX_TTL
from ..utils.fields import Fields
from ..utils.db import URL_ID_KEY, create_url_key, create_user_key, url_id_base62
from ..utils.urls import create_short_url


class RedisException(BaseException):
    pass


async def get_url_id(pool):
    url_id = await pool.incr(URL_ID_KEY)
    return url_id


async def _execute_transaction(transaction):
    try:
        result = await transaction.execute()
    except MultiExecError as exc:
        raise RedisException(f"Error in Redis transaction: {exc}")
    return result


@guard(ttl=(Int(gt=SHORT_URL_MIN_TTL) & Int(lt=SHORT_URL_MAX_TTL+1)), allow_extra="*")
async def remember_long_url(pool, long_url, ttl, user_id):
    url_id = await get_url_id(pool)
    url_id = url_id_base62(url_id)
    url_key = create_url_key(url_id)
    url_info = {
        Fields.URL_REDIRECTS: 0,
        Fields.URL_LONG: long_url
    }
    transaction = pool.multi_exec()
    transaction.hmset_dict(url_key, url_info)
    if user_id is not None:
        user_key = create_user_key(user_id)
        transaction.sadd(user_key, url_id)
    transaction.expire(url_key, ttl)
    await _execute_transaction(transaction)
    return url_id


async def get_long_url(pool, url_id):
    url_key = create_url_key(url_id)
    print(url_key)
    long_url = await pool.hget(url_key, Fields.URL_LONG)
    if not long_url:
        return
    await pool.hincrby(url_key, Fields.URL_REDIRECTS)
    return long_url


async def get_urls_for_user(pool, user_id):
    user_key = create_user_key(user_id)
    user_url_ids = await pool.smembers(user_key)
    user_urls = []
    print(user_url_ids)
    for url_id in user_url_ids:
        url_key = create_url_key(url_id)
        url_info = await pool.hgetall(url_key)
        if not url_info:
            pool.srem(user_key, url_id)
            continue
        url_info[Fields.URL_SHORT] = create_short_url(url_id)
        user_urls.append(url_info)
    return user_urls
