import base62

from .fields import Fields


URL_ID_KEY = "shortify:key"
URL_KEY = "shortify:{url_id}"
USER_KEY = "user:{user_id}"


def create_redis_url(redis_config):
    dsn = "redis://{host}:{port}/{database}"
    return dsn.format(**redis_config)


def redis_pool(request):
    app = request.app
    return app[Fields.REDIS]


def url_id_base62(url_id):
    return base62.encode(url_id)


def create_url_key(url_id):
    key = URL_KEY.format(url_id=url_id)
    return key


def create_user_key(user_id):
    key = USER_KEY.format(user_id=user_id)
    return key
