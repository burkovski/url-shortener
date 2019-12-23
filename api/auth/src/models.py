from asyncpg.pool import Pool
from sqlalchemy import (
    MetaData, Table, Column, CheckConstraint,
    Integer, String
)


meta = MetaData()


users = Table(
    "users", meta,
    Column("id", Integer, primary_key=True),
    Column("email", String(20), nullable=False, unique=True),
    Column("password", String(64), nullable=False),
    CheckConstraint(
        r"email ~ '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+" 
        r"@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?"
        r"(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$'"
    )
)


tables_to_create = [users]
