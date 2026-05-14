import { createClient } from "@insforge/sdk";

/**
 * InsForge client instance for the dashboard app.
 * Shares the same project as the landing page.
 */
export const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL ?? "",
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY ?? "",
});
