import type { Express } from "express";

/**
 * Development-only Vite middleware setup.
 * Dynamically loads Vite only when running in development mode.
 * This ensures production builds have zero runtime dependency on 'vite'.
 */
export async function setupViteDev(app: Express): Promise<void> {
  const { createServer } = await import("vite");
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
}
