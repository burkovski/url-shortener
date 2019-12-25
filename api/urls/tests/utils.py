import datetime

from ..src.settings import BASE_DIR, get_config


TEST_CONFIG_PATH = BASE_DIR / "config.test.yaml"
TEST_CONFIG = get_config(TEST_CONFIG_PATH)
APP_CONFIG = TEST_CONFIG["urls"]
REDIS_CONFIG = APP_CONFIG["redis"]


def create_expire_at():
    now = datetime.datetime.utcnow()
    delta = datetime.timedelta(days=10)
    expire_at = now + delta
    return int(expire_at.timestamp())


URLS = [
    "https://github.com/burkovski/url-shortener",
    "https://github.com/burkovski/url-shortener",
    "https://github.com/burkovski/url-shortener",
    "https://github.com/burkovski/url-shortener",
    "https://github.com/burkovski/url-shortener",
    "https://github.com/burkovski/url-shortener",
    "https://github.com/burkovski/url-shortener",
    "https://github.com/burkovski/url-shortener",
    "https://github.com/burkovski/url-shortener",
    "https://github.com/burkovski/url-shortener",
    "https://github.com/burkovski/url-shortener"
]

