import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const outDir = resolve("dist");
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

for (const dir of ["src", "ui", "worlds", "db", "docs"]) {
  cpSync(resolve(dir), resolve(outDir, dir), { recursive: true });
}

for (const file of [".env.example", "package.json", "README.md"]) {
  cpSync(resolve(file), resolve(outDir, file));
}

writeFileSync(
  resolve(outDir, "BUILD_INFO.txt"),
  "Runtime package prepared. Start with: node src/server.mjs\n",
  "utf8"
);

console.log("Build completed: dist/ contains runnable runtime package.");
