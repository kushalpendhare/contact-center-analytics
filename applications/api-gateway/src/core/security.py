import base64
import hashlib
import hmac
import json
import os
import time

from fastapi import HTTPException
from fastapi import status

from src.core.config import settings


TOKEN_TTL_SECONDS = 60 * 60 * 8


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        100_000
    )

    return (
        "pbkdf2_sha256$100000$"
        f"{base64.urlsafe_b64encode(salt).decode('utf-8')}$"
        f"{base64.urlsafe_b64encode(password_hash).decode('utf-8')}"
    )


def verify_password(password: str, stored_hash: str) -> bool:
    try:
        algorithm, iterations, salt, password_hash = stored_hash.split("$")

        if algorithm != "pbkdf2_sha256":
            return False

        test_hash = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            base64.urlsafe_b64decode(salt.encode("utf-8")),
            int(iterations)
        )

        return hmac.compare_digest(
            base64.urlsafe_b64encode(test_hash).decode("utf-8"),
            password_hash
        )
    except Exception:
        return False


def _base64_url_encode(payload: bytes) -> str:
    return base64.urlsafe_b64encode(payload).decode("utf-8").rstrip("=")


def _base64_url_decode(payload: str) -> bytes:
    padding = "=" * (-len(payload) % 4)
    return base64.urlsafe_b64decode((payload + padding).encode("utf-8"))


def create_access_token(user_id: int) -> str:
    header = {
        "alg": "HS256",
        "typ": "JWT"
    }
    payload = {
        "sub": str(user_id),
        "exp": int(time.time()) + TOKEN_TTL_SECONDS
    }

    encoded_header = _base64_url_encode(json.dumps(header).encode("utf-8"))
    encoded_payload = _base64_url_encode(json.dumps(payload).encode("utf-8"))
    signing_input = f"{encoded_header}.{encoded_payload}".encode("utf-8")
    signature = hmac.new(
        settings.AUTH_SECRET_KEY.encode("utf-8"),
        signing_input,
        hashlib.sha256
    ).digest()

    return f"{encoded_header}.{encoded_payload}.{_base64_url_encode(signature)}"


def decode_access_token(token: str) -> int:
    try:
        encoded_header, encoded_payload, encoded_signature = token.split(".")
        signing_input = f"{encoded_header}.{encoded_payload}".encode("utf-8")
        expected_signature = hmac.new(
            settings.AUTH_SECRET_KEY.encode("utf-8"),
            signing_input,
            hashlib.sha256
        ).digest()

        if not hmac.compare_digest(
            _base64_url_encode(expected_signature),
            encoded_signature
        ):
            raise ValueError("Invalid signature")

        payload = json.loads(_base64_url_decode(encoded_payload))

        if int(payload["exp"]) < int(time.time()):
            raise ValueError("Expired token")

        return int(payload["sub"])
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
