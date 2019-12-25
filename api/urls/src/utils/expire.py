import datetime
import os
import math


SHORT_URL_MIN_TTL = int(os.environ["SHORT_URL_MIN_TTL"])
SHORT_URL_MAX_TTL = int(os.environ["SHORT_URL_MAX_TTL"])


def expire_date_to_ttl(expire_at):
    expire_date = datetime.datetime.utcfromtimestamp(expire_at)
    now = datetime.datetime.utcnow()
    delta = expire_date - now
    ttl = delta.total_seconds()
    return math.ceil(ttl)
