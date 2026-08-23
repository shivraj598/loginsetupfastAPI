# Customer Login & Sign-Up API

Production-grade customer authentication API for an online store, built with **FastAPI + SQLAlchemy (async)**.

- Passwords hashed with **bcrypt** (Passlib)
- **HttpOnly / SameSite=Lax / Secure** cookie sessions via JWT
- Fully async: engine, sessions, handlers, dependencies
- SQLite for local dev; PostgreSQL-ready (`asyncpg`) — just change `DATABASE_URL`

## Project structure

```
app/
├── config.py     # Settings loaded from .env (pydantic-settings)
├── database.py   # Async engine, sessionmaker, Base, get_db dependency
├── security.py   # bcrypt hashing/verification, JWT create/decode
├── models.py     # SQLAlchemy User table + Pydantic request/response schemas
└── main.py       # FastAPI app, CORS, routes, get_current_user dependency
```

## Setup

```bash
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # then edit values
```

Run:

```bash
uvicorn app.main:app --reload
# Swagger docs: http://localhost:8000/docs
```

> Set `COOKIE_SECURE=true` in production so the cookie is only sent over HTTPS.

## Switching to PostgreSQL later

1. `DATABASE_URL=postgresql+asyncpg://user:password@host:5432/store_db` in `.env` (the `asyncpg` driver is already installed).
2. Replace startup `create_all` in `app/main.py` lifespan with Alembic migrations.

## Endpoints

| Method | Path            | Auth        | Description                                  |
| ------ | --------------- | ----------- | -------------------------------------------- |
| POST   | `/signup`       | —           | Create account. `400` if email exists        |
| POST   | `/signin`       | —           | Sets `access_token` HttpOnly cookie. `401` on bad credentials |
| POST   | `/signout`      | —           | Clears the session cookie                    |
| GET    | `/customers/me` | cookie JWT  | Current authenticated customer. `401` otherwise |

## Quick test

```bash
curl -X POST localhost:8000/signup -H 'Content-Type: application/json' \
  -d '{"email":"jane@example.com","full_name":"Jane Doe","password":"SuperSecret123"}'

curl -c cookies.txt -X POST localhost:8000/signin -H 'Content-Type: application/json' \
  -d '{"email":"jane@example.com","password":"SuperSecret123"}'

curl -b cookies.txt localhost:8000/customers/me
```
