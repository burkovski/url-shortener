import pytest

from pytest_aiohttp import aiohttp_client
from .utils import URLS, create_expire_at


@pytest.mark.parametrize("long_url", URLS)
async def test_shortify_and_redirect_urls(client: aiohttp_client, long_url):
    expire_at = create_expire_at()
    shortify_resp = await client.post("/shortify", json={"url_long": long_url, "expire_at": expire_at})
    assert shortify_resp.status == 201
    shortify_resp_json = await shortify_resp.json()
    assert "created" in shortify_resp_json
    short_url = shortify_resp_json["created"]
    url_id = short_url.split('/')[-1]
    redirect_resp = await client.get(f'/redirect/{url_id}', allow_redirects=False)
    assert redirect_resp.status == 302
    redirect_resp = await client.get(f'/redirect/{url_id}')
    assert str(redirect_resp.url) == long_url
