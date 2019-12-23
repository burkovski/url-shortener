from aiohttp import web
from src.app import make_app
from src.settings import CONFIG


def main(config):
    app = make_app(config)
    web.run_app(app)


if __name__ == "__main__":
    main(CONFIG)
    main(None)
