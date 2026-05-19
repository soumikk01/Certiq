import { MongoClient } from "mongodb";

/**
 * better-auth instance for Certiq authentication.
 *
 * Uses dynamic imports because better-auth is ESM-only and the NestJS
 * project uses CommonJS module format. The auth instance is initialized
 * asynchronously and accessed via getAuth().
 */

let authInstance: any;

const authReady: Promise<void> = (async () => {
  const { betterAuth } = await import("better-auth");
  const { mongodbAdapter } = await import("better-auth/adapters/mongodb");

  const mongoClient = new MongoClient(
    process.env.MONGODB_URI ?? "mongodb://localhost:27017/certiq",
  );
  await mongoClient.connect();

  authInstance = betterAuth({
    database: mongodbAdapter(mongoClient.db()),
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.API_BASE_URL ?? "http://localhost:12500",
    basePath: "/api/auth",

    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      maxPasswordLength: 128,
    },

    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      },
      linkedin: {
        clientId: process.env.LINKEDIN_CLIENT_ID ?? "",
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET ?? "",
      },
    },

    session: {
      expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
      updateAge: 24 * 60 * 60, // Refresh session after 24 hours
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60, // 5 minutes
      },
    },

    advanced: {
      cookiePrefix: "certiq-auth",
      crossSubDomainCookies: { enabled: false },
      defaultCookieAttributes: {
        httpOnly: true,
        sameSite: "lax" as const,
        secure: process.env.NODE_ENV === "production",
        path: "/",
      },
    },

    trustedOrigins: [
      "http://localhost:12000",
      "http://localhost:12001",
      ...(process.env.CORS_ORIGINS
        ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim())
        : []),
    ],
  });
})();

/**
 * Returns the initialized better-auth instance.
 * Awaits the async initialization if not yet complete.
 */
export async function getAuth() {
  await authReady;
  return authInstance;
}

/**
 * Direct reference to the auth instance.
 * Only use after authReady has resolved (e.g., after NestJS module init).
 */
export { authInstance as auth, authReady };
