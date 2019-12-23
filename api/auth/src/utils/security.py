import bcrypt
import os
import jwt
import uuid
import datetime
from .fields import Fields


PASSWORD_ENCODING = "utf-8"


def generate_password_hash(password):
    password_bin = password.encode(PASSWORD_ENCODING)
    hashed = bcrypt.hashpw(password_bin, bcrypt.gensalt())
    return hashed.decode(PASSWORD_ENCODING)


def check_password_hash(plain_password, password_hash):
    plain_password_bin = plain_password.encode(PASSWORD_ENCODING)
    password_hash_bin = password_hash.encode(PASSWORD_ENCODING)
    is_correct = bcrypt.checkpw(plain_password_bin, password_hash_bin)
    return is_correct


def get_secret_key():
    secret = os.environ['SECRET_KEY']
    return secret


def create_token(user_id):
    secret = get_secret_key()
    exp_date = datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
    exp_date_in_seconds = int(exp_date.timestamp())
    jwt_payload = {
        Fields.JWT_USER_ID: user_id,
        Fields.JWT_EXPIRES: exp_date_in_seconds
    }
    token = jwt.encode(jwt_payload, secret)
    return token.decode()


def create_refresh_token():
    uuid_ = uuid.uuid4()
    return uuid_.hex
