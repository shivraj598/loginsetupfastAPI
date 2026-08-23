from datetime import UTC, datetime, timedelta
from typing import Any

import jwt
from passlib.context import CryptContext

from .config import settings

# ---------------------------------------------------------------------------
# SECURITY VALUES BELOW ARE OVERRIDDEN VIA .env:
#   SECRET_KEY                  (REQUIRED in production: openssl rand -hex 32)
#   ALGORITHM                   (HS256 default)
#   ACCESS_TOKEN_EXPIRE_MINUTES (token lifetime)
# ---------------------------------------------------------------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

BCRYPT_MAX_BYTES = 72


def hash_password(plain_password: str) -> str:
    return pwd_context.hash(plain_password[:BCRYPT_MAX_BYTES])


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return pwd_context.verify(
            plain_password[:BCRYPT_MAX_BYTES], hashed_password
        )
    except ValueError:
        return False


def create_access_token(subject: str | Any) -> str:
    expire = datetime.now(UTC) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    payload = {"sub": str(subject), "exp": expire}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> dict[str, Any]:
    """Decode and validate a JWT. Raises jwt.ExpiredSignatureError /
    jwt.InvalidTokenError which callers must translate into 401s."""
    return jwt.decode(
        token,
        settings.SECRET_KEY,
        algorithms=[settings.ALGORITHM],
        options={"require": ["sub", "exp"]},
    )
