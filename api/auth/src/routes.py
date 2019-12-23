from aiohttp import web
from . import handlers


def setup_routes(app: web.Application) -> None:
    app.router.add_routes([
        web.get("/", handlers.handle_get_all_users),    # SHOULD BE REMOVED!
        web.post("/", handlers.handle_create_user),
        web.post("/token", handlers.handle_create_token),
        web.put("/token", handlers.handle_refresh_token)
    ])
