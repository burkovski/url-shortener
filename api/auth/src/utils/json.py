import trafaret as t

from aiohttp.web import HTTPBadRequest
from .fields import Fields


_email_scheme = t.Dict({
    t.Key(Fields.EMAIL): t.Email
})

_password_scheme = t.Dict({
    t.Key(Fields.PASSWORD): t.Regexp(regexp=r'^[A-Za-z0-9_]{4,64}$')
})

_token_scheme = t.Dict({
    t.Key(Fields.TOKEN): t.Regexp(regexp=r'^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+$'),
})

_ref_token_scheme = t.Dict({
    t.Key(Fields.REF_TOKEN): t.Regexp(regexp=r'^[0-9a-f]{32}$')
})


def _fetcher(data, scheme, key, exc_msg):
    scheme = scheme.allow_extra('*')
    try:
        data = scheme(data)
    except t.DataError as exc:
        print(exc)
        raise HTTPBadRequest(reason=exc_msg)
    return data[key]


def fetch_email(json):
    return _fetcher(json, _email_scheme, Fields.EMAIL, "Invalid email")


def fetch_password(json):
    return _fetcher(json, _password_scheme, Fields.PASSWORD, "Invalid password")


def fetch_token(json):
    return _fetcher(json, _token_scheme, Fields.TOKEN, "Invalid JWT")


def fetch_ref_token(json):
    return _fetcher(json, _ref_token_scheme, Fields.REF_TOKEN, "Invalid refresh token")
