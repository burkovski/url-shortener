import sys; sys.path.insert(0, '.'); sys.path.insert(1, '..')

import pytest

from .utils import PostgresTools, RedisTools, TEST_CONFIG
from ..src.models import tables_to_create
from ..src.app import make_app


@pytest.yield_fixture(scope='session')
def postgres():
    with PostgresTools.conn() as conn:
        conn.setup_test_db()
        yield
        conn.teardown_test_db()


@pytest.yield_fixture(scope='session')
def tables(postgres):
    with PostgresTools.conn() as conn:
        conn.create_tables(tables_to_create)
        conn.init_db()
        yield
        conn.drop_tables(tables_to_create)


@pytest.yield_fixture(scope='session')
def redis():
    redis_tool = RedisTools()
    redis_tool.connect()
    yield
    redis_tool.clear()
    redis_tool.disconnect()


@pytest.fixture
async def client(aiohttp_client, tables, redis):
    app = make_app(TEST_CONFIG)
    return await aiohttp_client(app)



