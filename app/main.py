from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from jwt import ExpiredSignatureError, InvalidTokenError
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from .config import settings
from .database import Base, engine, get_db
from .models import SignInRequest, User, UserCreate, UserRead
from .security import create_access_token, decode_access_token, hash_password, verify_password


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Dev convenience only. Production deployments must use Alembic migrations.
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# CORS — allow_credentials=True is REQUIRED so browsers send/receive cookies.
# Allowed origins come from .env: CORS_ORIGINS=["https://yourstore.com", ...]
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)


async def get_current_user(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> User:
    """Dependency that authenticates a customer from the HttpOnly cookie,
    decodes/validates the JWT, and loads the matching database row."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated.",
    )

    token = request.cookies.get(settings.COOKIE_NAME)
    if not token:
        raise credentials_exception

    try:
        payload = decode_access_token(token)
        user_id = int(payload["sub"])
    except (ExpiredSignatureError, KeyError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired. Please sign in again.",
        )
    except InvalidTokenError:
        raise credentials_exception

    user = await db.get(User, user_id)
    if user is None or not user.is_active:
        raise credentials_exception
    return user


@app.post("/signup", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def signup(payload: UserCreate, db: AsyncSession = Depends(get_db)) -> User:
    result = await db.execute(select(User).where(User.email == payload.email))
    if result.scalar_one_or_none() is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists.",
        )

    user = User(
        email=payload.email,
        full_name=payload.full_name,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists.",
        )
    await db.refresh(user)
    return user


@app.post("/signin", response_model=UserRead)
async def signin(
    payload: SignInRequest,
    db: AsyncSession = Depends(get_db),
) -> JSONResponse:
    result = await db.execute(select(User).where(User.email == payload.email))
    user = result.scalar_one_or_none()

    if user is None or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated.",
        )

    token = create_access_token(subject=user.id)
    response = JSONResponse(content=UserRead.model_validate(user).model_dump(mode="json"))
    response.set_cookie(
        key=settings.COOKIE_NAME,
        value=token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )
    return response


@app.post("/signout")
async def signout() -> JSONResponse:
    response = JSONResponse(content={"detail": "Signed out successfully."})
    response.delete_cookie(key=settings.COOKIE_NAME, path="/")
    return response


@app.get("/customers/me", response_model=UserRead)
async def read_customers_me(current_user: User = Depends(get_current_user)) -> User:
    return current_user


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
