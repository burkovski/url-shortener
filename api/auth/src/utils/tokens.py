import os


def get_ref_token_ttl():
    thirty_days_in_seconds = 2592000
    ref_token_ttl = os.getenv("REF_TOKEN_TTL", thirty_days_in_seconds)
    if not isinstance(ref_token_ttl, int):
        ref_token_ttl = int(ref_token_ttl)
    return ref_token_ttl


