import os


def get_secret_key():
    secret = os.environ["SECRET_KEY"]
    return secret
