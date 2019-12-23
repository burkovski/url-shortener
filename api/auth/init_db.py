from sqlalchemy import MetaData, create_engine
from src.models import tables_to_create
from src.settings import CONFIG


def create_tables(engine):
    meta = MetaData()
    meta.create_all(bind=engine, tables=tables_to_create)


def create_db_dsn(db_config):
    db_user = db_config["user"]
    db_password = db_config["password"]
    db_host = db_config["host"]
    db_port = db_config["port"]
    db_name = db_config["database"]
    dsn = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
    return dsn


def main(config):
    db_config = config["postgres"]
    dsn = create_db_dsn(db_config)
    engine = create_engine(dsn)
    create_tables(engine)


if __name__ == "__main__":
    main(CONFIG)
