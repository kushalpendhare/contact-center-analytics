import os

from datetime import datetime
from datetime import timedelta

from jose import jwt
from jose import JWTError

from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY",
    "secret"
)

ALGORITHM = os.getenv(
    "JWT_ALGORITHM",
    "HS256"
)

EXPIRE_MINUTES = int(
    os.getenv(
        "JWT_EXPIRE_MINUTES",
        "1440"
    )
)


def hash_password(
    password: str
):
    return pwd_context.hash(
        password
    )


def verify_password(
    plain_password: str,
    hashed_password: str
):
    return pwd_context.verify(
        plain_password,
        hashed_password
    )


def create_access_token(
    data: dict
):
    payload = data.copy()

    expire = (
        datetime.utcnow()
        + timedelta(
            minutes=EXPIRE_MINUTES
        )
    )

    payload.update(
        {"exp": expire}
    )

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def decode_token(
    token: str
):
    try:
        return jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

    except JWTError:
        return None