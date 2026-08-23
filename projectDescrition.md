# Customer Login and Sign-Up API

Act as a Principal Backend Architect and build a complete, runnable, highly secure customer login and sign-up API for a scalable online store using Python, FastAPI, and SQLAlchemy. Provide the implementation as four clearly labeled, complete code blocks named `database.py`, `security.py`, `models.py`, and `main.py`. Include every required import, configuration value, model, schema, dependency, route, and error-handling path; do not use pseudocode or omit core-function code.

Please provide the implementation split clearly into separate architectural files:

- database.py (Async engine, session local, and base declarative class)
- security.py (Password hashing utilities, verification, JWT token creation, and validation mechanisms)
- models.py (SQLAlchemy user tables and Pydantic validation/response schemas)
- main.py (FastAPI app initialization, CORS middleware configuration, route handlers, and dependency injections)

Enforce the following strict rules:

1. No Plain Text: Passwords must be hashed using Passlib's bcrypt implementation.
2. Async Everywhere: All database operations, route handlers, and dependency functions must be fully asynchronous (using 'async def' and 'await').
3. Cookie-Based Session Security: Upon a successful login (/signin), the server must set an 'access_token' cookie marked as HttpOnly, Secure, and SameSite='Lax'.
4. Route Protection: Build a clean dependency injection function named `get_current_user` that extracts the HttpOnly cookie, decodes the JWT, verifies its expiration, and pulls the corresponding customer row from the database. Use this to protect a GET /customers/me endpoint.
5. Production Readiness: Include graceful error states using FastAPI's HTTPException (e.g., 401 Unauthorized for bad credentials, 400 Bad Request for pre-existing email signups). Add a placeholder section or comment indicating where environment variables (.env) should override hardcoded secret strings.

Deliver complete, working code blocks with zero placeholders or omitted code blocks inside the core functions.
