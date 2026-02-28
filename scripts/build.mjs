import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const outDir = resolve("dist");
mkdirSync(outDir, { recursive: true });
writeFileSync(
  resolve(outDir, "BUILD_INFO.txt"),
  "Bootstrap build placeholder. Real build pipeline will be introduced in subsequent tasks.\n",
  "utf8"
);

console.log("Build placeholder artifact generated in dist/BUILD_INFO.txt");
