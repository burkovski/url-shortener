import pytest
import re

from pytest_aiohttp import aiohttp_client
from .utils import USER_TO_CREATE, USERS


async def test_create_user(client: aiohttp_client):
    email = USER_TO_CREATE["email"]
    password = USER_TO_CREATE["password"]
    resp = await client.post("/users", json={"email": email, "password": password})
    assert resp.status == 201
    json_resp = await resp.json()
    assert "created" in json_resp
    assert json_resp["created"] == USER_TO_CREATE["email"]


@pytest.mark.parametrize("user", USERS)
async def test_login_user(client: aiohttp_client, user):
    resp = await client.post("/tokens", json=user)
    assert resp.status == 201
    json_resp = await resp.json()
    assert "created" in json_resp
    tokens = json_resp["created"]
    assert isinstance(tokens, dict)
    assert all(map(lambda k: k in {"token", "refresh_token"}, tokens))
    assert re.match(r'^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+$', tokens['token'])
    assert re.match(r'^[0-9a-f]{32}$', tokens['refresh_token'])


@pytest.mark.parametrize("user", USERS)
async def test_refresh_tokens(client: aiohttp_client, user):
    login_resp = await client.post("/tokens", json=user)
    assert login_resp.status == 201
    login_json = await login_resp.json()
    tokens = login_json["created"]
    refresh_resp = await client.put("/tokens", json={'refresh_token': tokens['refresh_token']})
    assert refresh_resp.status == 201
    refresh_json = await refresh_resp.json()
    assert "created" in refresh_json
    new_tokens = refresh_json["created"]
    assert isinstance(new_tokens, dict)
    assert all(map(lambda k: k in {"token", "refresh_token"}, new_tokens))
    assert re.match(r'^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+$', new_tokens['token'])
    assert re.match(r'^[0-9a-f]{32}$', new_tokens['refresh_token'])
    assert tokens != new_tokens


@pytest.mark.parametrize("user", USERS)
async def test_delete_tokens(client: aiohttp_client, user):
    login_resp = await client.post("/tokens", json=user)
    assert login_resp.status == 201
    login_json = await login_resp.json()
    tokens = login_json["created"]
    delete_resp = await client.delete("/tokens", json={"refresh_token": tokens["refresh_token"]})
    assert delete_resp.status == 200
    delete_json = await delete_resp.json()
    assert "deleted" in delete_json
    assert delete_json["deleted"] == tokens["refresh_token"]
