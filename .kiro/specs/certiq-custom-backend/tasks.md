# Implementation Plan: Certiq Custom Backend

## Overview

Replace InsForge authentication and PostgreSQL/Prisma with a self-hosted monolithic backend using better-auth (MongoDB adapter), Mongoose ODM, Redis caching, and Cloudflare R2 storage. Implementation proceeds in phases: database migration, auth module, infrastructure services, business modules, frontend migration, InsForge removal, Docker setup, and final verification.

## Tasks

- [x] 1. Database migration — Remove Prisma, install Mongoose
  - [x] 1.1 Install Mongoose dependencies and remove Prisma
    - Add `@nestjs/mongoose`, `mongoose`, `mongodb` to `apps/api` dependencies
    - Remove `@prisma/client`, `pg` from dependencies
    - Remove `prisma` from devDependencies
    - Run `pnpm install` from monorepo root
    - _Requirements: 4.1, 4.8_

  - [x] 1.2 Delete Prisma files and module
    - Delete `apps/api/prisma/` directory (schema.prisma and any migrations)
    - Delete `apps/api/src/prisma/prisma.module.ts`
    - Delete `apps/api/src/prisma/prisma.service.ts`
    - _Requirements: 4.8_

  - [x] 1.3 Create DatabaseModule with Mongoose connection
    - Create `apps/api/src/database/database.module.ts` using `MongooseModule.forRootAsync()`
    - Configure connection from `MONGODB_URI` environment variable
    - _Requirements: 4.1_

  - [x] 1.4 Create Mongoose schemas
    - Create `apps/api/src/database/schemas/user.schema.ts` (email unique, name, avatarUrl, emailVerified)
    - Create `apps/api/src/database/schemas/account.schema.ts` (userId, providerId, accountId, password, tokens)
    - Create `apps/api/src/database/schemas/session.schema.ts` (userId, token unique, expiresAt TTL index)
    - Create `apps/api/src/database/schemas/verification.schema.ts` (identifier, value, expiresAt TTL index)
    - Create `apps/api/src/database/schemas/resume.schema.ts` (userId, title, templateId, content, published, shareSlug)
    - Create `apps/api/src/database/schemas/certificate.schema.ts` (userId, title, issuer, objectKey, credUrl, verified)
    - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.6_

  - [x] 1.5 Update AppModule to use DatabaseModule
    - Replace `PrismaModule` import with `DatabaseModule` in `app.module.ts`
    - _Requirements: 4.1_

- [x] 2. Checkpoint — Verify database module compiles
  - Run `pnpm --filter @certiq/api run build`
  - Ensure no Prisma references remain in API source

- [x] 3. Auth module — Install better-auth with MongoDB adapter
  - [x] 3.1 Install better-auth dependencies
    - Add `better-auth` to `apps/api` dependencies
    - _Requirements: 7.1_

  - [x] 3.2 Create better-auth instance
    - Create `apps/api/src/auth/auth.ts` with better-auth configuration
    - Use `mongodbAdapter` with MongoDB connection
    - Configure email/password (min 8, max 128)
    - Configure Google and LinkedIn social providers from env vars
    - Configure session (7-day expiry, 24h refresh, 5min cookie cache)
    - Configure cookies (prefix "certiq-auth", httpOnly, sameSite=lax, secure in prod, path="/")
    - Set trustedOrigins to localhost:12000 and localhost:12001
    - Set basePath to `/api/auth`
    - _Requirements: 1.1, 1.5, 1.6, 2.1, 2.2, 3.1, 3.5, 3.6, 3.7, 10.6_

  - [x] 3.3 Rewrite AuthModule
    - Replace `apps/api/src/auth/auth.module.ts`
    - Create NestJS controller that catches all `/auth/*` routes and delegates to better-auth
    - Export auth instance for use by AuthGuard
    - _Requirements: 7.1, 7.5_

  - [x] 3.4 Rewrite AuthGuard with session validation
    - Replace `apps/api/src/auth/auth.guard.ts`
    - Use `auth.api.getSession()` to validate session from cookie
    - Implement @Public() decorator to skip auth on marked routes
    - Attach user (id, email, name, avatarUrl) to request
    - Throw UnauthorizedException for invalid/missing/expired sessions
    - _Requirements: 7.2, 7.3, 7.4_

  - [x] 3.5 Create @Session() parameter decorator
    - Replace `apps/api/src/auth/current-user.decorator.ts` with @Session() decorator
    - Extract user object from request context
    - _Requirements: 7.4_

  - [x] 3.6 Update main.ts bootstrap
    - Disable body parser (`bodyParser: false`)
    - Update CORS with CORS_ORIGINS env var support
    - Ensure credentials: true
    - _Requirements: 7.7, 10.1, 10.2, 10.3_

  - [x] 3.7 Update environment variable files
    - Update `apps/api/.env.example` with all new variables
    - Update `apps/api/.env` with placeholder values
    - _Requirements: 7.6_

- [x] 4. Checkpoint — Verify auth module compiles
  - Run `pnpm --filter @certiq/api run build`

- [x] 5. Infrastructure modules — Redis and R2
  - [x] 5.1 Install infrastructure dependencies
    - Add `ioredis`, `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`, `multer` to dependencies
    - Add `@types/multer`, `fast-check` to devDependencies
    - _Requirements: 5.1, 6.1_

  - [x] 5.2 Create CacheModule and CacheService
    - Create `apps/api/src/cache/cache.module.ts`
    - Create `apps/api/src/cache/cache.service.ts` with get/set/del/delPattern
    - Connect to Redis via REDIS_URL env var
    - Implement graceful degradation (catch all errors, log warning, return null)
    - Implement 500ms timeout on operations
    - _Requirements: 5.1, 5.6, 5.7_

  - [x] 5.3 Create StorageModule and StorageService
    - Create `apps/api/src/storage/storage.module.ts`
    - Create `apps/api/src/storage/storage.service.ts` with upload/delete/getPresignedUrl
    - Configure S3Client with R2 endpoint and credentials from env vars
    - Set Content-Disposition: attachment on presigned URLs
    - Throw ServiceUnavailableException on R2 connection failure
    - _Requirements: 6.1, 6.2, 6.5, 6.9, 6.10_

  - [x] 5.4 Create file validation utility
    - Create `apps/api/src/storage/file-validator.ts`
    - Implement magic-byte detection for PNG, JPEG, WebP, PDF
    - Validate size against MAX_FILE_SIZE env var (default 5MB)
    - Return structured error codes: FILE_TOO_LARGE, INVALID_FILE_TYPE, FILE_REQUIRED, INVALID_FILE
    - _Requirements: 6.7, 6.8_

- [x] 6. Checkpoint — Verify infrastructure modules compile
  - Run `pnpm --filter @certiq/api run build`

- [x] 7. Business modules — Update to Mongoose + Cache + R2
  - [x] 7.1 Rewrite UsersModule with Mongoose
    - Update `apps/api/src/users/users.service.ts` to use Mongoose User model
    - Update `apps/api/src/users/users.controller.ts` to use @Session() decorator
    - Implement GET /users/me endpoint
    - _Requirements: 7.4_

  - [x] 7.2 Rewrite ResumesModule with Mongoose
    - Update `apps/api/src/resumes/resumes.service.ts` to use Mongoose Resume model
    - Update `apps/api/src/resumes/resumes.controller.ts` to use @Session() decorator
    - Enforce user ownership on all operations
    - _Requirements: 4.5, 7.2_

  - [x] 7.3 Rewrite CertificatesModule with Mongoose + R2 + Cache
    - Update `apps/api/src/certificates/certificates.service.ts`:
      - Implement upload with R2 storage and MongoDB write (atomic rollback)
      - Implement findAll with Redis cache and presigned URL resolution
      - Implement findOne with Redis cache and presigned URL resolution
      - Implement delete with R2 cleanup and cache invalidation
      - Implement update with cache invalidation
    - Update `apps/api/src/certificates/certificates.controller.ts`:
      - Add POST /certificates/upload with multer FileInterceptor
      - Update GET /certificates to return presigned URLs
      - Update GET /certificates/:id to return presigned URL
      - Update DELETE /certificates/:id with R2 cleanup
    - Update `apps/api/src/certificates/certificates.module.ts`:
      - Import StorageModule and CacheModule
    - _Requirements: 5.1–5.5, 6.1–6.10_

  - [x] 7.4 Create DTOs with validation
    - Create `apps/api/src/certificates/dto/create-certificate.dto.ts` (title 1-200, issuer 1-200, credUrl optional)
    - Create `apps/api/src/certificates/dto/update-certificate.dto.ts`
    - _Requirements: 6.7_

  - [x] 7.5 Wire all modules in AppModule
    - Update `apps/api/src/app.module.ts` to import: DatabaseModule, AuthModule, CacheModule, StorageModule, UsersModule, ResumesModule, CertificatesModule, HealthModule
    - Remove any remaining Prisma references
    - _Requirements: 7.5_

- [x] 8. Checkpoint — Verify full backend builds
  - Run `pnpm --filter @certiq/api run build`
  - Ensure all modules are properly wired

- [x] 9. Frontend migration — Web App
  - [x] 9.1 Install better-auth client in Web App
    - Add `better-auth` to `apps/web` dependencies
    - Remove `@insforge/sdk` from `apps/web` dependencies
    - Add `NEXT_PUBLIC_API_URL=http://localhost:12500` to `.env.local` and `.env.example`
    - _Requirements: 8.1, 9.1_

  - [x] 9.2 Create auth-client.ts for Web App
    - Create `apps/web/lib/auth-client.ts` using createAuthClient from better-auth/react
    - Configure with NEXT_PUBLIC_API_URL and basePath "/api/auth"
    - _Requirements: 8.1_

  - [x] 9.3 Delete InsForge client file
    - Delete `apps/web/lib/insforge.ts`
    - _Requirements: 9.1_

  - [x] 9.4 Rewrite AuthProvider for Web App
    - Replace `apps/web/lib/auth/AuthProvider.tsx` with better-auth implementation
    - Use authClient.useSession() for state
    - Expose: user, loading, signInWithGoogle, signInWithLinkedIn, signInWithEmail, signUp, signOut
    - Redirect to Dashboard_App on successful sign-in
    - _Requirements: 8.1, 8.3, 8.5, 8.6_

  - [x] 9.5 Update LoginModal
    - Update `apps/web/components/LoginModal.tsx` to use new useAuth() hook
    - Wire OAuth buttons and email/password form
    - Display error messages
    - _Requirements: 8.1, 8.5_

  - [x] 9.6 Remove InsForge env vars from Web App
    - Remove NEXT_PUBLIC_INSFORGE_URL and NEXT_PUBLIC_INSFORGE_ANON_KEY from .env.local and .env.example
    - _Requirements: 9.5_

- [x] 10. Frontend migration — Dashboard App
  - [x] 10.1 Install better-auth client in Dashboard App
    - Add `better-auth` to `apps/dashboard` dependencies
    - Remove `@insforge/sdk` from `apps/dashboard` dependencies
    - Add `NEXT_PUBLIC_API_URL=http://localhost:12500` to `.env.local` and `.env.example`
    - _Requirements: 8.2, 9.2_

  - [x] 10.2 Create auth-client.ts for Dashboard App
    - Create `apps/dashboard/lib/auth-client.ts` using createAuthClient
    - Configure with NEXT_PUBLIC_API_URL and basePath "/api/auth"
    - _Requirements: 8.2_

  - [x] 10.3 Delete InsForge client file (if exists)
    - Delete `apps/dashboard/lib/insforge.ts` if it exists
    - _Requirements: 9.2_

  - [x] 10.4 Rewrite DashboardAuthProvider
    - Replace `apps/dashboard/lib/auth.tsx` with better-auth implementation
    - Session retry logic (3 attempts, 800ms apart, max 5s)
    - Redirect to Web_App if no session after retries
    - Min loading time 2500ms for animation
    - Expose: user, loading, signOut
    - _Requirements: 8.2, 8.4, 8.5, 8.7_

  - [x] 10.5 Update Dashboard components
    - Update `apps/dashboard/components/DashboardContent.tsx` to use new useDashboardAuth() hook
    - Update `apps/dashboard/components/ProfileDropdown.tsx` (if exists) to use signOut
    - _Requirements: 8.7_

  - [x] 10.6 Remove InsForge env vars from Dashboard
    - Remove NEXT_PUBLIC_INSFORGE_URL and NEXT_PUBLIC_INSFORGE_ANON_KEY from .env.local and .env.example
    - _Requirements: 9.5_

- [x] 11. Checkpoint — Verify frontend builds
  - Run `pnpm run build` across all apps
  - Verify no InsForge imports remain

- [x] 12. InsForge final cleanup
  - [x] 12.1 Remove InsForge from API
    - Remove any remaining INSFORGE_URL references from `apps/api/.env` and `.env.example`
    - Verify no InsForge references in any API source file
    - _Requirements: 9.3, 9.5_

  - [x] 12.2 Clean lockfile and verify
    - Run `pnpm install` to update lockfile
    - Run `pnpm run build` across all apps
    - Grep for "insforge" across entire codebase — must return zero results
    - _Requirements: 9.4, 9.6_

- [x] 13. Docker setup
  - [x] 13.1 Create docker-compose.yml
    - Create `docker-compose.yml` at project root
    - Define mongodb service (mongo:7, port 27017, healthcheck, named volume)
    - Define redis service (redis:7-alpine, port 6379, AOF, healthcheck, named volume)
    - Define api service (build from Dockerfile, port 12500, all env vars, depends_on healthy)
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [x] 13.2 Create API Dockerfile
    - Create `apps/api/Dockerfile` with multi-stage build
    - Use node:20-alpine with pnpm
    - Stages: deps → builder → runner
    - _Requirements: 11.6_

- [x] 14. Optional property tests
  - [x] 14.1 Write property tests for authentication (Properties 1–5)
    - Sign-up round trip, sign-in round trip, duplicate rejection, generic errors, password hashing
    - _Requirements: 1.1–1.7_

  - [x] 14.2 Write property tests for certificates (Properties 6–10)
    - Upload-retrieve round trip, ownership isolation, cache invalidation, upload atomicity, file validation
    - _Requirements: 5.1–5.5, 6.1–6.8_

  - [x] 14.3 Write property test for cache degradation (Property 11)
    - Redis unavailable → system still works from MongoDB/R2
    - _Requirements: 5.6_

- [x] 15. Final verification
  - Run `pnpm run build` for all apps — must succeed
  - Run `pnpm --filter @certiq/api run test` — all tests pass
  - Verify no InsForge references: `grep -r "insforge" apps/` returns nothing
  - Verify API health endpoint responds at /api/health
  - Ask user if questions arise

## Notes

- Tasks marked with `*` are optional property tests — can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- The better-auth library handles auth logic internally; tasks focus on configuration and integration
- MongoDB does not require migrations — schemas are defined in code
- Prisma removal is done early to avoid compilation conflicts
- Frontend migration can proceed in parallel for web and dashboard after backend is ready

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["1.3", "1.4", "1.5"] },
    { "id": 2, "tasks": ["3.1"] },
    { "id": 3, "tasks": ["3.2", "3.3", "3.4", "3.5", "3.6", "3.7"] },
    { "id": 4, "tasks": ["5.1"] },
    { "id": 5, "tasks": ["5.2", "5.3", "5.4"] },
    { "id": 6, "tasks": ["7.1", "7.2", "7.3", "7.4", "7.5"] },
    { "id": 7, "tasks": ["9.1", "9.2", "9.3", "10.1", "10.2", "10.3"] },
    { "id": 8, "tasks": ["9.4", "9.5", "9.6", "10.4", "10.5", "10.6"] },
    { "id": 9, "tasks": ["12.1", "12.2"] },
    { "id": 10, "tasks": ["13.1", "13.2"] },
    { "id": 11, "tasks": ["14.1", "14.2", "14.3"] }
  ]
}
```
