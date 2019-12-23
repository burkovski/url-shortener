class Fields:
    POSTGRES = "postgres"
    REDIS    = "redis"

    PG_ID  = "id"
    EMAIL    = "email"
    PASSWORD = "password"

    JWT_USER_ID = "user_id"
    JWT_EXPIRES = "exp"

    CREATED   = "created"
    TOKEN     = "token"
    REF_TOKEN = "refresh_token"


def get_fields(from_, *fields):
    return map(lambda field: from_[field], fields)
