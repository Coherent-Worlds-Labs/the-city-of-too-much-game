import { resolve } from "node:path";

const parseDatabasePath = (databaseUrl) => {
  if (!databaseUrl) {
    return resolve("data/the-city-of-too-much.db");
  }
  if (databaseUrl.startsWith("file:")) {
    return resolve(databaseUrl.slice("file:".length));
  }
  return resolve(databaseUrl);
};

export const readRuntimeConfig = () => ({
  nodeEnv: process.env.NODE_ENV ?? "development",
  appPort: Number.parseInt(process.env.APP_PORT ?? "3000", 10),
  databasePath: parseDatabasePath(process.env.DATABASE_URL),
  assetsDir: resolve(process.env.ASSETS_DIR ?? "storage/images"),
  publicAssetsBaseUrl: process.env.PUBLIC_ASSETS_BASE_URL ?? "/assets",
  openRouterApiKey: process.env.OPENROUTER_API_KEY ?? "",
  openRouterBaseUrl: process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1",
  openRouterDebug:
    ["1", "true", "yes", "on"].includes((process.env.OPENROUTER_DEBUG ?? "").toLowerCase()),
  judgeModel: process.env.JUDGE_MODEL ?? "openai/gpt-5-mini",
  imageModel: process.env.IMAGE_MODEL ?? "openai/gpt-5-image",
  imageAspectRatio: process.env.IMAGE_ASPECT_RATIO ?? "21:9",
  imageOutputSize: process.env.IMAGE_OUTPUT_SIZE ?? "672x288",
  imageQuality: process.env.IMAGE_QUALITY ?? "low",
  maxHistoryEntries: Number.parseInt(process.env.MAX_HISTORY_ENTRIES ?? "120", 10),
  rateLimitWindowMs: Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? "60000", 10),
  rateLimitMaxRequests: Number.parseInt(process.env.RATE_LIMIT_MAX_REQUESTS ?? "30", 10)
});
