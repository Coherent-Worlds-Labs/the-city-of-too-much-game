import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const requiredPaths = [
  "package.json",
  "tsconfig.json",
  ".env.example",
  "src/app",
  "src/api",
  "src/domain",
  "src/infra",
  "worlds/the-city-of-too-much.en.json"
];

let failed = false;
for (const relPath of requiredPaths) {
  const fullPath = resolve(relPath);
  if (!existsSync(fullPath)) {
    console.error(`[missing] ${relPath}`);
    failed = true;
  }
}

const pkg = JSON.parse(readFileSync(resolve("package.json"), "utf8"));
for (const scriptName of ["lint", "typecheck", "test", "build"]) {
  if (!pkg.scripts || !pkg.scripts[scriptName]) {
    console.error(`[missing script] ${scriptName}`);
    failed = true;
  }
}

if (failed) {
  process.exitCode = 1;
} else {
  console.log("Bootstrap scaffold looks consistent.");
}
