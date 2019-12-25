from aiohttp import web
from . import handlers


def setup_routes(app: web.Application) -> None:
    app.router.add_routes([
        web.post("/tokens", handlers.handle_create_token),
        web.put("/tokens", handlers.handle_refresh_token),
        web.delete("/tokens", handlers.handle_delete_token),
        web.post("/users", handlers.handle_create_user)
    ])
