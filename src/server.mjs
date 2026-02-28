import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { createSqliteStore } from "./infra/sqlite-store.mjs";
import { loadDefaultWorldPack } from "./infra/world-pack-loader.mjs";
import { createOpenRouterJudge } from "./infra/openrouter-judge.mjs";
import { createImagePipeline } from "./infra/image-pipeline.mjs";
import {
  createInMemoryRateLimiter,
  createTurnDedupeCache
} from "./infra/reliability.mjs";
import { readRuntimeConfig } from "./infra/runtime-config.mjs";
import { createRuntimeApi } from "./api/runtime-api.mjs";

const config = readRuntimeConfig();

const worldPack = loadDefaultWorldPack();
const store = createSqliteStore({
  dbPath: config.databasePath
});
const runtimeApi = createRuntimeApi({
  store,
  worldPack,
  judge: createOpenRouterJudge({
    apiKey: config.openRouterApiKey,
    baseUrl: config.openRouterBaseUrl,
    model: config.judgeModel
  }),
  imagePipeline: createImagePipeline({
    apiKey: config.openRouterApiKey,
    baseUrl: config.openRouterBaseUrl,
    model: config.imageModel,
    assetsDir: config.assetsDir,
    publicAssetsBaseUrl: "/assets"
  }),
  reliability: {
    rateLimiter: createInMemoryRateLimiter({
      windowMs: config.rateLimitWindowMs,
      maxRequests: config.rateLimitMaxRequests
    }),
    dedupeCache: createTurnDedupeCache(),
    maxHistoryEntries: config.maxHistoryEntries
  }
});

const mimeByExt = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg"
};

const sendJson = (res, status, payload) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
};

const readBody = (req) =>
  new Promise((resolveBody, rejectBody) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        resolveBody(data ? JSON.parse(data) : {});
      } catch (error) {
        rejectBody(error);
      }
    });
    req.on("error", rejectBody);
  });

const serveFile = (res, filePath) => {
  if (!existsSync(filePath)) {
    res.statusCode = 404;
    res.end("Not found");
    return;
  }
  const ext = extname(filePath).toLowerCase();
  res.statusCode = 200;
  res.setHeader("Content-Type", mimeByExt[ext] ?? "application/octet-stream");
  res.end(readFileSync(filePath));
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
    const { pathname } = url;

    if (req.method === "POST" && pathname === "/api/games") {
      const body = await readBody(req);
      const created = runtimeApi.createGame({ seed: body.seed ?? null });
      sendJson(res, 201, created);
      return;
    }

    if (req.method === "GET" && pathname === "/api/health") {
      sendJson(res, 200, {
        status: "ok",
        service: "the-city-of-too-much-game",
        endpoints: ["/api/games", "/api/turn", "/api/games/:id/history", "/api/games/:id/timeline"]
      });
      return;
    }

    if (req.method === "POST" && pathname === "/api/turn") {
      const body = await readBody(req);
      const played = await runtimeApi.playTurn({
        gameId: body.gameId,
        cardId: body.cardId,
        expectedTurn: body.expectedTurn ?? null
      });
      sendJson(res, 200, played);
      return;
    }

    if (req.method === "GET" && pathname.startsWith("/api/games/") && pathname.endsWith("/history")) {
      const gameId = pathname.split("/")[3];
      sendJson(res, 200, { history: runtimeApi.getHistory(gameId) });
      return;
    }

    if (req.method === "GET" && pathname.startsWith("/api/games/") && pathname.endsWith("/timeline")) {
      const gameId = pathname.split("/")[3];
      sendJson(res, 200, { timeline: runtimeApi.getTimeline(gameId) });
      return;
    }

    if (pathname === "/" || pathname === "/index.html") {
      serveFile(res, resolve("ui/index.html"));
      return;
    }
    if (pathname === "/timeline" || pathname === "/timeline.html") {
      serveFile(res, resolve("ui/timeline.html"));
      return;
    }
    if (pathname === "/styles.css" || pathname === "/main.js" || pathname === "/timeline.js") {
      serveFile(res, resolve(`ui${pathname}`));
      return;
    }
    if (pathname.startsWith("/ui/")) {
      serveFile(res, resolve(`.${pathname}`));
      return;
    }
    if (pathname.startsWith("/src/")) {
      serveFile(res, resolve(`.${pathname}`));
      return;
    }
    if (pathname.startsWith("/worlds/")) {
      serveFile(res, resolve(`.${pathname}`));
      return;
    }
    if (pathname.startsWith("/assets/")) {
      const fileName = pathname.replace("/assets/", "");
      serveFile(res, join(config.assetsDir, fileName));
      return;
    }

    res.statusCode = 404;
    res.end("Not found");
  } catch (error) {
    sendJson(res, 500, {
      error: error.message
    });
  }
});

server.listen(config.appPort, () => {
  console.log(`Server started on http://localhost:${config.appPort}`);
});
