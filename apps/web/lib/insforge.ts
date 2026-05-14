import { createClient } from "@insforge/sdk";

/**
 * InsForge client instance for authentication and backend services.
 *
 * The base URL points to your InsForge project.
 * Configure NEXT_PUBLIC_INSFORGE_URL and NEXT_PUBLIC_INSFORGE_ANON_KEY
 * in your .env.local file.
 */
export const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL ?? "",
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY ?? "",
});
