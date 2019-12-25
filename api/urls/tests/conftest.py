import sys; sys.path.insert(0, '.'); sys.path.insert(1, '..')

import pytest

from .utils import TEST_CONFIG
from ..src.app import make_app


@pytest.fixture
async def client(aiohttp_client):
    app = make_app(TEST_CONFIG)
    return await aiohttp_client(app)



