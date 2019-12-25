class Fields:
    REDIS = "redis"

    JWT_USER_ID = "user_id"
    JWT_EXPIRES = "exp"

    USER = "user"
    USER_ID = "user_id"
    URL_LONG = "url_long"
    URL_SHORT = "url_short"
    URL_EXPIRE_AT = "expire_at"
    URL_REDIRECTS = "redirects"

    CREATED   = "created"
    DELETED   = "deleted"
    TOKEN     = "token"
    REF_TOKEN = "refresh_token"


def get_user_id(request):
    try:
        user = request[Fields.USER]
        user_id = user[Fields.USER_ID]
    except KeyError:
        return None
    return user_id


def get_fields(from_, *fields):
    return map(lambda field: from_[field], fields)
