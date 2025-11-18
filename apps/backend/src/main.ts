import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger as honoLogger } from "hono/logger";
import { trpcServer } from "@hono/trpc-server";
import { appRouter, createContext } from "./trpc";
import { logger } from "./lib/logger";
import { auth } from "./lib/auth";
import { authMiddleware } from "./middleware/auth";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use("*", honoLogger());

app.get("/", (c) => {
  logger.info("Root endpoint accessed");
  return c.json({
    message: "Welcome to the API",
    version: "1.0.0",
    endpoints: {
      api: "/api/v1",
      auth: "/api/auth",
    },
  });
});

app.use(
  "/api/v1/*",
  trpcServer({
    endpoint: "/api/v1",
    router: appRouter,
    createContext,
  })
);

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
  })
);


app.on(["POST", "GET"], "/api/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

app.get("/health", (c) => {
  logger.debug("Health check performed");
  return c.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

const port = process.env.PORT || 8081;

export default {
  port,
  fetch: app.fetch,
};

logger.info(`🚀 Server is running on http://localhost:${port}`);
