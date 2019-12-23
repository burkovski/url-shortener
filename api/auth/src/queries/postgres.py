from asyncpg.pool import Pool
from ..models import users


async def get_all_users(conn: Pool):
    query = users.select()
    return await conn.fetch(query)


async def create_user(conn: Pool, email: str, password: str) -> None:
    query = users.insert().values(email=email, password=password)
    await conn.execute(query)


async def get_user_by_email(conn: Pool, email: str):
    query = users.select().where(users.c.email == email)
    user = await conn.fetchrow(query)
    return user
