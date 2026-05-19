# Requirements Document: Certiq Custom Backend

## Introduction

This document specifies the requirements for replacing the current InsForge-based authentication and PostgreSQL/Prisma data layer in the Certiq monorepo with a fully self-hosted monolithic backend. The new system uses MongoDB (via Mongoose) for persistence, better-auth for cookie-based session authentication with Google/LinkedIn OAuth and email/password flows, Redis for caching, and Cloudflare R2 for certificate image storage. All InsForge dependencies are removed and both frontend apps connect directly to the custom backend.

## Glossary

- **Auth_Server**: The better-auth instance running within the NestJS API that handles all authentication operations.
- **Auth_Client**: The better-auth React client SDK used in frontend apps to interact with the Auth_Server.
- **Session**: A server-side document in MongoDB representing an authenticated user's login, identified by a cookie token.
- **Account**: A MongoDB document linking a User to an authentication provider (credential, Google, or LinkedIn).
- **API**: The NestJS monolithic application (apps/api) running on port 12500.
- **Web_App**: The Next.js landing page (apps/web) on port 12000.
- **Dashboard_App**: The Next.js dashboard (apps/dashboard) on port 12001.
- **R2**: Cloudflare R2 object storage accessed via S3-compatible API.
- **CacheService**: The Redis-backed caching layer with graceful degradation.
- **ObjectKey**: The path identifier for a file in R2: `certificates/{userId}/{uuid}.{ext}`.
- **Presigned_URL**: A time-limited HTTPS URL granting temporary access to an R2 object.

## Requirements

### Requirement 1: Email/Password Authentication

**User Story:** As a user, I want to sign up and sign in with my email and password, so that I can access Certiq without relying on third-party providers.

#### Acceptance Criteria

1. WHEN a user submits a valid email (RFC 5322, ≤254 chars) and password (8–128 chars) for sign-up, THE Auth_Server SHALL create a User document, Account document, and Session document in MongoDB and return a session cookie.
2. WHEN a user submits valid credentials for sign-in, THE Auth_Server SHALL validate the password against the stored hash and return a session cookie.
3. IF a user submits an email that already exists during sign-up, THEN THE Auth_Server SHALL return an error indicating the email is already registered without revealing account details.
4. IF a user submits invalid credentials during sign-in, THEN THE Auth_Server SHALL return a generic authentication error without revealing whether the email or password was incorrect.
5. THE Auth_Server SHALL hash passwords using bcrypt or argon2 before storing them in the Account document.
6. IF a user submits a password shorter than 8 or longer than 128 characters, THEN THE Auth_Server SHALL return a validation error.
7. IF a user submits an email that does not conform to RFC 5322 format, THEN THE Auth_Server SHALL return a validation error.

### Requirement 2: OAuth Authentication (Google and LinkedIn)

**User Story:** As a user, I want to sign in with my Google or LinkedIn account, so that I can access Certiq quickly.

#### Acceptance Criteria

1. WHEN a user initiates Google OAuth sign-in, THE Auth_Server SHALL redirect to Google's authorization endpoint with correct client credentials and callback URL.
2. WHEN a user initiates LinkedIn OAuth sign-in, THE Auth_Server SHALL redirect to LinkedIn's authorization endpoint with correct client credentials and callback URL.
3. WHEN the OAuth provider redirects back with a valid authorization code, THE Auth_Server SHALL exchange the code for user profile information, create or link an Account document, create a Session, and redirect to the Dashboard_App.
4. IF the OAuth callback contains an error or invalid code, THEN THE Auth_Server SHALL redirect to the Web_App with a query parameter indicating the failure reason.
5. WHEN an OAuth user has an existing account with a case-insensitive email match, THE Auth_Server SHALL link the new provider to the existing User rather than creating a duplicate.
6. IF the OAuth provider does not return an email address, THEN THE Auth_Server SHALL reject the authentication and redirect with an error parameter.

### Requirement 3: Session Management

**User Story:** As a user, I want my login session to persist across page reloads and between the Web_App and Dashboard_App.

#### Acceptance Criteria

1. WHEN a user successfully authenticates, THE Auth_Server SHALL create a Session document in MongoDB and set an HTTP-only cookie with a 7-day expiration.
2. WHEN a frontend app makes an API request with a valid session cookie, THE API SHALL identify the user from the Session document and attach user info to the request context.
3. IF a request has a missing, malformed, or expired session cookie, THEN THE API SHALL reject it with HTTP 401.
4. WHEN a user calls the sign-out endpoint, THE Auth_Server SHALL delete the Session document and clear the cookie.
5. WHEN a session is within 24 hours of expiry and the user makes a request, THE Auth_Server SHALL extend the session by 7 days.
6. THE Auth_Server SHALL set cookies with path="/", httpOnly=true, sameSite=lax, and secure=true in production.
7. THE session cookie SHALL be shared between Web_App (port 12000) and Dashboard_App (port 12001) on localhost.

### Requirement 4: MongoDB Database

**User Story:** As a developer, I want the application to use MongoDB for all data persistence, replacing PostgreSQL/Prisma.

#### Acceptance Criteria

1. THE API SHALL connect to MongoDB using Mongoose and store all application data in a single database.
2. THE API SHALL define a User collection with fields: email (unique), name, avatarUrl, emailVerified, createdAt, updatedAt.
3. THE API SHALL define an Account collection with fields: userId, providerId, accountId, accessToken, refreshToken, password (hashed), with a unique compound index on (providerId, accountId).
4. THE API SHALL define a Session collection with fields: userId, token (unique), expiresAt, ipAddress, userAgent, with a TTL index on expiresAt.
5. THE API SHALL define a Resume collection with fields: userId, title, templateId, content (JSON), published, shareSlug (unique sparse), createdAt, updatedAt.
6. THE API SHALL define a Certificate collection with fields: userId, title, issuer, objectKey, credUrl, verified, createdAt, updatedAt.
7. WHEN a User is deleted, THE API SHALL cascade-delete all associated Accounts, Sessions, Resumes, and Certificates.
8. THE API SHALL remove all Prisma-related files (schema.prisma, prisma module, migrations) and dependencies (@prisma/client, prisma, pg).

### Requirement 5: Redis Caching

**User Story:** As a platform operator, I want certificate data cached in Redis to reduce database and R2 load.

#### Acceptance Criteria

1. WHEN a certificate is retrieved and a cache entry exists, THE CacheService SHALL serve cached data without querying MongoDB.
2. WHEN a certificate is retrieved and no cache exists, THE API SHALL fetch from MongoDB and cache with TTL 300 seconds.
3. WHEN a presigned URL is generated, THE API SHALL cache it with TTL 3300 seconds (55 minutes).
4. WHEN a user's certificate list is retrieved, THE API SHALL cache the list with TTL 60 seconds.
5. WHEN a certificate is created, updated, or deleted, THE API SHALL invalidate all related cache entries.
6. IF Redis is unavailable, THEN THE CacheService SHALL fall through to MongoDB/R2 with no error visible to the client.
7. IF a Redis operation exceeds 500ms, THEN THE CacheService SHALL abandon the operation and proceed without caching.

### Requirement 6: Cloudflare R2 Object Storage

**User Story:** As a user, I want to upload certificate images that are stored securely and accessible via time-limited URLs.

#### Acceptance Criteria

1. WHEN a user uploads a certificate image, THE API SHALL store it in R2 at ObjectKey `certificates/{userId}/{uuid}.{ext}`.
2. WHEN a certificate is retrieved, THE API SHALL resolve the objectKey to a Presigned_URL with 1-hour expiry.
3. WHEN a certificate is deleted, THE API SHALL remove the R2 object and the MongoDB document.
4. IF the MongoDB write fails after a successful R2 upload, THEN THE API SHALL delete the R2 object (rollback).
5. IF R2 is unreachable during upload, THEN THE API SHALL return HTTP 503.
6. IF R2 is unreachable during URL generation, THEN THE API SHALL return the certificate with null imageUrl.
7. THE API SHALL validate uploaded files: max 5MB, allowed types PNG/JPEG/WebP/PDF, verified by magic bytes.
8. IF a file fails validation, THEN THE API SHALL reject with HTTP 400 and no R2 object or document SHALL be created.
9. THE API SHALL generate ObjectKeys using UUIDs, never incorporating user-provided filenames.
10. THE API SHALL set Content-Disposition: attachment on presigned download URLs.

### Requirement 7: NestJS Backend Architecture

**User Story:** As a developer, I want the backend to follow clean monolithic NestJS patterns.

#### Acceptance Criteria

1. THE API SHALL expose better-auth endpoints under `/api/auth/*` for all authentication operations.
2. THE API SHALL provide a global AuthGuard that validates session cookies on every request except routes marked with @Public().
3. IF the AuthGuard determines the session is invalid, THEN THE API SHALL return HTTP 401.
4. THE API SHALL provide a @Session() decorator that extracts the authenticated user from the request context.
5. THE API SHALL organize code into modules: AuthModule, DatabaseModule, CacheModule, StorageModule, UsersModule, ResumesModule, CertificatesModule, HealthModule.
6. THE API SHALL use environment variables for all sensitive configuration.
7. THE API SHALL disable the NestJS body parser (required by better-auth to handle its own request parsing).
8. WHEN the API starts, it SHALL connect to MongoDB and verify the connection is healthy.
9. IF MongoDB connection fails on startup, THEN THE API SHALL exit with a non-zero code.

### Requirement 8: Frontend Auth Client Integration

**User Story:** As a user, I want the landing page and dashboard to use the custom backend seamlessly.

#### Acceptance Criteria

1. THE Web_App SHALL use the better-auth React client SDK configured with the API base URL to perform sign-in, sign-up, and sign-out.
2. THE Dashboard_App SHALL use the better-auth React client SDK to retrieve session and user information.
3. WHEN a user signs in on the Web_App, THE Auth_Client SHALL redirect to the Dashboard_App after success.
4. WHEN the Dashboard_App loads without a valid session, it SHALL retry up to 3 times within 5 seconds, then redirect to the Web_App.
5. IF the API is unreachable, THEN THE Auth_Client SHALL display an error and not leave the app unresponsive.
6. THE Web_App SHALL provide an AuthProvider context exposing: user, loading, signInWithGoogle, signInWithLinkedIn, signInWithEmail, signUp, signOut.
7. THE Dashboard_App SHALL provide a DashboardAuthProvider context exposing: user, loading, signOut.

### Requirement 9: InsForge Removal

**User Story:** As a developer, I want all InsForge dependencies completely removed from the codebase.

#### Acceptance Criteria

1. WHEN migration is complete, THE Web_App SHALL have no imports or files related to @insforge/sdk.
2. WHEN migration is complete, THE Dashboard_App SHALL have no imports or files related to @insforge/sdk.
3. WHEN migration is complete, THE API SHALL have no references to InsForge URLs, token validation, or InsForge types.
4. WHEN migration is complete, all package.json files SHALL have @insforge/sdk removed and the lockfile updated.
5. WHEN migration is complete, all .env files SHALL have no INSFORGE-prefixed variables.
6. WHEN migration is complete, `pnpm run build` SHALL succeed across all apps with no unresolved imports.

### Requirement 10: CORS and Security

**User Story:** As a developer, I want proper CORS and security settings for frontend-backend communication.

#### Acceptance Criteria

1. THE API SHALL allow CORS from http://localhost:12000 and http://localhost:12001 with credentials enabled.
2. THE API SHALL include Access-Control-Allow-Credentials: true in cross-origin responses.
3. THE API SHALL accept configurable production origins via CORS_ORIGINS environment variable.
4. IF a request originates from an unlisted origin, THEN THE API SHALL omit CORS headers.
5. WHEN the API receives a preflight OPTIONS request from an allowed origin, it SHALL respond with 204 and correct headers.
6. THE Auth_Server SHALL set cookies with SameSite=Lax, HttpOnly=true, and Secure=true in production.

### Requirement 11: Docker Support

**User Story:** As a developer, I want to run the full stack locally with Docker Compose.

#### Acceptance Criteria

1. THE Docker configuration SHALL include services for MongoDB 7, Redis 7, and the API.
2. THE Docker configuration SHALL expose MongoDB on port 27017, Redis on port 6379, and API on port 12500.
3. THE Docker configuration SHALL use health checks for MongoDB and Redis, with the API depending on both being healthy.
4. THE Docker configuration SHALL persist MongoDB data and Redis data using named volumes.
5. THE Docker configuration SHALL pass all required environment variables to the API container.
6. THE API Dockerfile SHALL use multi-stage build with node:20-alpine and pnpm.
