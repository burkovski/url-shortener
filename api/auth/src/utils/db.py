from .fields import Fields


def create_postgres_url(db_config):
    dsn = "postgresql://{user}:{password}@{host}:{port}/{database}"
    return dsn.format(**db_config)


def create_redis_url(redis_config):
    dsn = "redis://{host}:{port}"
    return dsn.format(**redis_config)


def postgres_pool(request):
    app = request.app
    return app[Fields.POSTGRES]


def redis_pool(request):
    app = request.app
    return app[Fields.REDIS]
