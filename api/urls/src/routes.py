from aiohttp import web
from . import handlers


def setup_routes(app: web.Application) -> None:
    app.router.add_routes([
        web.post("/shortify", handlers.handle_shortify_url),
        web.get("/redirect/{url_id}", handlers.handle_redirect),
        web.get("/owned", handlers.handle_get_user_owned_urls)
    ])
