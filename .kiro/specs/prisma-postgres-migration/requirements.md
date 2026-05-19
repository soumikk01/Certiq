# Requirements Document

## Introduction

This specification defines the migration of the Certiq API database layer from Mongoose/MongoDB to Prisma ORM with cloud PostgreSQL. The migration replaces all Mongoose schemas, the MongooseModule, and the better-auth MongoDB adapter with Prisma equivalents. The application connects to a cloud PostgreSQL instance via a `DATABASE_URL` environment variable. No existing data requires migration; the database starts from a clean slate. Redis caching and R2 storage modules remain unchanged.

## Glossary

- **API**: The NestJS backend application located at `apps/api`
- **Prisma_Client**: The auto-generated Prisma Client used to query the PostgreSQL database
- **Prisma_Schema**: The `schema.prisma` file defining data models, relations, and database connection
- **PrismaService**: A NestJS injectable service that extends Prisma_Client and manages the database connection lifecycle
- **DatabaseModule**: The global NestJS module that provides PrismaService to all other modules
- **Auth_Module**: The module containing the better-auth configuration and authentication logic
- **Docker_Compose**: The `docker-compose.yml` file defining local development services
- **UUID**: Universally Unique Identifier used as primary key format (`@default(uuid())`)

## Requirements

### Requirement 1: Prisma Schema Definition

**User Story:** As a developer, I want a Prisma schema that models all existing entities with UUID primary keys and proper relations, so that the PostgreSQL database structure matches the current MongoDB collections.

#### Acceptance Criteria

1. THE Prisma_Schema SHALL define a `User` model with fields: `id` (UUID primary key), `email` (unique string), `name` (optional string), `avatarUrl` (optional string), `emailVerified` (boolean, default false), `createdAt` (DateTime), and `updatedAt` (DateTime).
2. THE Prisma_Schema SHALL define an `Account` model with fields: `id` (UUID primary key), `userId` (foreign key to User), `providerId` (string), `accountId` (string), `accessToken` (optional string), `refreshToken` (optional string), `accessTokenExpiresAt` (optional DateTime), `refreshTokenExpiresAt` (optional DateTime), `password` (optional string), `createdAt` (DateTime), and `updatedAt` (DateTime).
3. THE Prisma_Schema SHALL define a `Session` model with fields: `id` (UUID primary key), `userId` (foreign key to User), `token` (unique string), `expiresAt` (DateTime), `ipAddress` (optional string), `userAgent` (optional string), `createdAt` (DateTime), and `updatedAt` (DateTime).
4. THE Prisma_Schema SHALL define a `Verification` model with fields: `id` (UUID primary key), `identifier` (string), `value` (string), `expiresAt` (DateTime), `createdAt` (DateTime), and `updatedAt` (DateTime).
5. THE Prisma_Schema SHALL define a `Resume` model with fields: `id` (UUID primary key), `userId` (foreign key to User), `title` (string, default "Untitled Resume"), `templateId` (string, default "executive"), `content` (JSON, default empty object), `published` (boolean, default false), `shareSlug` (optional unique string), `createdAt` (DateTime), and `updatedAt` (DateTime).
6. THE Prisma_Schema SHALL define a `Certificate` model with fields: `id` (UUID primary key), `userId` (foreign key to User), `title` (string), `issuer` (string), `objectKey` (optional string), `credUrl` (optional string), `verified` (boolean, default false), `createdAt` (DateTime), and `updatedAt` (DateTime).
7. THE Prisma_Schema SHALL define a unique compound index on the Account model for the combination of `providerId` and `accountId`.
8. THE Prisma_Schema SHALL define a relation from each child model (Account, Session, Resume, Certificate) to the User model via the `userId` field with cascading delete behavior.
9. THE Prisma_Schema SHALL use the `postgresql` provider in the datasource block and read the connection string from the `DATABASE_URL` environment variable.
10. THE Prisma_Schema SHALL use `@default(uuid())` for all primary key `id` fields.

### Requirement 2: PrismaService Implementation

**User Story:** As a developer, I want a PrismaService that manages the Prisma Client lifecycle within NestJS, so that database connections are properly established on startup and closed on shutdown.

#### Acceptance Criteria

1. THE PrismaService SHALL extend Prisma_Client and implement the NestJS `OnModuleInit` interface.
2. WHEN the NestJS application starts, THE PrismaService SHALL call `$connect()` to establish the database connection.
3. THE PrismaService SHALL be decorated as `@Injectable()` for NestJS dependency injection.
4. THE DatabaseModule SHALL export PrismaService globally so all modules can inject the service without importing DatabaseModule explicitly.

### Requirement 3: DatabaseModule Replacement

**User Story:** As a developer, I want the DatabaseModule to provide PrismaService instead of MongooseModule, so that the application uses Prisma for all database operations.

#### Acceptance Criteria

1. THE DatabaseModule SHALL remove all MongooseModule imports and configuration.
2. THE DatabaseModule SHALL register PrismaService as a provider and export the service.
3. THE DatabaseModule SHALL remain decorated with `@Global()` so PrismaService is available application-wide.
4. THE DatabaseModule SHALL remove the dependency on the `MONGODB_URI` configuration value.

### Requirement 4: Service Layer Migration

**User Story:** As a developer, I want all business services rewritten to use Prisma Client instead of Mongoose models, so that CRUD operations target PostgreSQL through Prisma.

#### Acceptance Criteria

1. THE UsersService SHALL inject PrismaService and use `prisma.user.findUnique()` for user lookups by ID.
2. THE ResumesService SHALL inject PrismaService and use Prisma_Client methods for create, findMany, findFirst, update, and delete operations on the Resume model.
3. THE CertificatesService SHALL inject PrismaService and use Prisma_Client methods for create, findMany, findFirst, update, and delete operations on the Certificate model.
4. WHEN a service performs a query filtered by `userId`, THE service SHALL pass the UUID string directly without ObjectId conversion.
5. THE CertificatesService SHALL maintain the existing R2 upload-then-persist pattern with rollback on database failure.
6. THE CertificatesService SHALL maintain the existing cache invalidation behavior after create, update, and delete operations.
7. THE ResumesService SHALL order results by `updatedAt` descending for list queries.
8. THE CertificatesService SHALL order results by `createdAt` descending for list queries.

### Requirement 5: Authentication Adapter Migration

**User Story:** As a developer, I want better-auth to use the Prisma adapter instead of the MongoDB adapter, so that authentication data is stored in PostgreSQL through the shared Prisma Client.

#### Acceptance Criteria

1. THE Auth_Module SHALL replace the `mongodbAdapter` import with the `prismaAdapter` from `better-auth/adapters/prisma`.
2. THE Auth_Module SHALL pass a Prisma_Client instance to the `prismaAdapter` function.
3. THE Auth_Module SHALL remove the standalone `MongoClient` connection and its associated `MONGODB_URI` usage.
4. THE Auth_Module SHALL retain all existing authentication configuration including email/password settings, social providers, session settings, cookie configuration, and trusted origins.

### Requirement 6: Dependency Management

**User Story:** As a developer, I want the package.json updated to replace MongoDB dependencies with Prisma dependencies, so that the project uses the correct packages.

#### Acceptance Criteria

1. THE API package.json SHALL add `@prisma/client` as a production dependency.
2. THE API package.json SHALL add `prisma` as a development dependency.
3. THE API package.json SHALL remove `mongoose`, `@nestjs/mongoose`, and `mongodb` from dependencies.
4. THE API package.json SHALL include a `prisma:generate` script that runs `prisma generate`.
5. THE API package.json SHALL include a `prisma:migrate` script that runs `prisma migrate dev`.
6. THE API package.json SHALL include a `prisma:push` script that runs `prisma db push`.

### Requirement 7: Environment Configuration

**User Story:** As a developer, I want environment variables updated to use DATABASE_URL instead of MONGODB_URI, so that the application connects to cloud PostgreSQL.

#### Acceptance Criteria

1. THE API `.env.example` file SHALL replace the `MONGODB_URI` variable with a `DATABASE_URL` variable containing a PostgreSQL connection string placeholder.
2. THE API `.env` file SHALL replace the `MONGODB_URI` variable with a `DATABASE_URL` variable.
3. THE Docker_Compose file SHALL remove the `mongodb` service definition and the `mongodb_data` volume.
4. THE Docker_Compose file SHALL remove the `MONGODB_URI` environment variable from the `api` service.
5. THE Docker_Compose file SHALL add a `DATABASE_URL` environment variable to the `api` service.
6. THE Docker_Compose file SHALL remove the `depends_on` condition for `mongodb` from the `api` service.
7. THE Docker_Compose file SHALL retain the `redis` service and `redis_data` volume unchanged.

### Requirement 8: Mongoose Removal

**User Story:** As a developer, I want all Mongoose-specific code removed from the codebase, so that no dead code or unused schemas remain after migration.

#### Acceptance Criteria

1. THE API source code SHALL remove the `database/schemas/` directory containing all Mongoose schema files.
2. THE API source code SHALL remove all `@InjectModel` decorators and Mongoose `Model` type imports from service files.
3. THE API source code SHALL remove all `MongooseModule.forFeature()` registrations from feature modules.
4. THE API source code SHALL remove all `Types.ObjectId` usage and replace identifier handling with UUID strings.
5. THE API source code SHALL remove the `mongoose` and `mongodb` package imports from all files.

### Requirement 9: Module Registration Updates

**User Story:** As a developer, I want feature modules updated to remove Mongoose model registrations and rely on the global PrismaService, so that the module dependency graph is correct.

#### Acceptance Criteria

1. THE UsersModule SHALL remove the `MongooseModule.forFeature()` import for the User model.
2. THE ResumesModule SHALL remove the `MongooseModule.forFeature()` import for the Resume model.
3. THE CertificatesModule SHALL remove the `MongooseModule.forFeature()` import for the Certificate model.
4. WHEN a feature module needs database access, THE feature module SHALL rely on PrismaService provided globally by DatabaseModule without additional imports.

### Requirement 10: ESM Compatibility

**User Story:** As a developer, I want the Prisma integration to work correctly within the existing ESM project configuration, so that imports resolve properly at runtime.

#### Acceptance Criteria

1. THE Prisma_Schema SHALL include the `output` configuration compatible with ESM module resolution.
2. THE PrismaService import statements SHALL use `.js` extensions consistent with the existing project convention.
3. IF Prisma Client generation fails due to ESM configuration, THEN THE build scripts SHALL include the necessary flags or configuration to resolve the incompatibility.
