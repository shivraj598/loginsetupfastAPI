from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from .config import settings

# ---------------------------------------------------------------------------
# DATABASE_URL is driven by .env:
#   SQLite (local dev):  sqlite+aiosqlite:///./dev.db
#   PostgreSQL (future): postgresql+asyncpg://user:password@host:5432/store_db
# The engine/session code below works identically for both drivers.
# ---------------------------------------------------------------------------
engine_kwargs: dict = {"echo": False}
if settings.DATABASE_URL.startswith("postgresql"):
    engine_kwargs["pool_pre_ping"] = True
    engine_kwargs["pool_size"] = 10
    engine_kwargs["max_overflow"] = 20

engine = create_async_engine(settings.DATABASE_URL, **engine_kwargs)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
