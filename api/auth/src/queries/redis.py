from aioredis import MultiExecError
from ..utils.tokens import get_ref_token_ttl


class RedisException(BaseException):
    pass


def _remember_transaction(pool, ref_token, user_id):
    ref_token_ttl = get_ref_token_ttl()
    transaction = pool.multi_exec()
    transaction.setnx(ref_token, user_id)
    transaction.expire(ref_token, ref_token_ttl)
    return transaction


async def _execute_transaction(transaction):
    try:
        result = await transaction.execute()
    except MultiExecError as exc:
        raise RedisException(f"Error in Redis transaction: {exc}")
    return result


async def remember_refresh_token(pool, ref_token, user_id):
    transaction = _remember_transaction(pool, ref_token, user_id)
    await _execute_transaction(transaction)


async def replace_refresh_token(pool, old_ref_token, new_ref_token, user_id):
    transaction = _remember_transaction(pool, new_ref_token, user_id)
    transaction.delete(old_ref_token)
    await _execute_transaction(transaction)


async def get_user_id_by_ref_token(pool, ref_token):
    user_id = await pool.get(ref_token)
    return user_id
