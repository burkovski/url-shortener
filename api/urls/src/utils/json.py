import trafaret as t

from aiohttp.web import HTTPBadRequest
from .fields import Fields


_url_long_scheme = t.Dict({
    t.Key(Fields.URL_LONG): t.URL
})

_expire_at_scheme = t.Dict({
    t.Key(Fields.URL_EXPIRE_AT): t.Int
})


def _fetcher(data, scheme, key, exc_msg):
    scheme = scheme.allow_extra('*')
    try:
        data = scheme(data)
    except t.DataError as exc:
        print(exc)
        raise HTTPBadRequest(reason=exc_msg)
    return data[key]


def fetch_long_url(json):
    return _fetcher(json, _url_long_scheme, Fields.URL_LONG, "Invalid long URL")


def fetch_url_expire_at(json):
    return _fetcher(json, _expire_at_scheme, Fields.URL_EXPIRE_AT, "Invalid expire time")
