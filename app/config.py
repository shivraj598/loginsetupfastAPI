from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


# ---------------------------------------------------------------------------
# ENVIRONMENT VARIABLES (.env) OVERRIDE EVERY DEFAULT BELOW.
# Copy .env.example -> .env and set real values before deploying.
# Generate a production SECRET_KEY with: openssl rand -hex 32
# ---------------------------------------------------------------------------
class Settings(BaseSettings):
    PROJECT_NAME: str = "Customer Auth API"
    API_V1_PREFIX: str = ""

    DATABASE_URL: str = "sqlite+aiosqlite:///./dev.db"

    SECRET_KEY: str = "change-me-in-production-openssl-rand-hex-32"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    COOKIE_NAME: str = "access_token"
    COOKIE_SECURE: bool = False
    COOKIE_SAMESITE: str = "lax"

    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
