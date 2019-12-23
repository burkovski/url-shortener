from aiohttp.web import Application

from .setup_databases import init_postgres, init_redis
from .routes import setup_routes
from .middleware import error_middleware


def make_app(config: dict) -> Application:
    app = Application(middlewares=[
        error_middleware
    ])
    app["config"] = config["auth"]
    setup_routes(app)
    app.cleanup_ctx.append(init_postgres)
    app.cleanup_ctx.append(init_redis)
    return app
