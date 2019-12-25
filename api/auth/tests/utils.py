from redis import Redis
from contextlib import contextmanager
from sqlalchemy import create_engine, MetaData
from ..src.settings import BASE_DIR, get_config, CONFIG
from ..src.utils.db import create_postgres_url, create_redis_url
from ..src.models import users
from ..src.utils.security import generate_password_hash


TEST_CONFIG_PATH = BASE_DIR / "config.test.yaml"
TEST_CONFIG = get_config(TEST_CONFIG_PATH)
APP_CONFIG = TEST_CONFIG["auth"]
POSTGRES_CONFIG = APP_CONFIG["postgres"]
REDIS_CONFIG = APP_CONFIG["redis"]


USER_TO_INSERT = {
    "email": "test@test.test",
    "password": "test"
}

USER_TO_CREATE = {
    "email": "foo@bar.baz",
    "password": "foobarbaz"
}

USERS = [USER_TO_INSERT, USER_TO_CREATE]


class MetaSingleton(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(MetaSingleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]


class PostgresTools(metaclass=MetaSingleton):
    def __init__(self, engine, test_engine, config, metadata):
        self.engine = engine
        self.test_engine = test_engine
        self.config = config
        self.metadata = metadata

    @classmethod
    @contextmanager
    def conn(cls):
        engine = create_engine(
            create_postgres_url(CONFIG["auth"]["postgres"]),
            isolation_level='AUTOCOMMIT'
        )
        test_engine = create_engine(
            create_postgres_url(POSTGRES_CONFIG),
            isolation_level='AUTOCOMMIT'
        )
        config = POSTGRES_CONFIG
        metadata = MetaData()
        try:
            yield cls(engine, test_engine, config, metadata)
        finally:
            engine.dispose()
            test_engine.dispose()

    def init_db(self):
        with self.test_engine.connect() as conn:
            query = users.insert().values(email=USER_TO_INSERT["email"],
                                          password=generate_password_hash(USER_TO_INSERT["password"]))
            conn.execute(query)

    def setup_test_db(self) -> None:
        db_name = self.config['database']
        db_user = self.config['user']
        self.teardown_test_db()
        with self.engine.connect() as conn:
            conn.execute(f"create database {db_name} encoding 'UTF8'")
            conn.execute(f"grant all privileges on database {db_name} to {db_user}")

    def teardown_test_db(self) -> None:
        db_name = self.config['database']
        with self.engine.connect() as conn:
            conn.execute(
                f"""
                SELECT pg_terminate_backend(pg_stat_activity.pid)
                FROM pg_stat_activity
                WHERE pg_stat_activity.datname = '{db_name}'
                AND pid <> pg_backend_pid();
                """
            )
            conn.execute(f"drop database if exists {db_name}")

    def create_tables(self, tables):
        self.metadata.create_all(bind=self.test_engine, tables=tables)

    def drop_tables(self, tables):
        self.metadata.drop_all(bind=self.test_engine, tables=tables)
