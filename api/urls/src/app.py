from aiohttp.web import Application

from .setup_databases import init_redis
from .routes import setup_routes
from .middleware import error_middleware, jwt_middleware


def make_app(config: dict) -> Application:
    app = Application(middlewares=[
        error_middleware,
        jwt_middleware
    ])
    app["config"] = config["urls"]
    setup_routes(app)
    app.cleanup_ctx.append(init_redis)
    return app
