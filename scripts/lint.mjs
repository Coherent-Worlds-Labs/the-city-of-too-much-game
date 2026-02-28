import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const files = ["README.md", "package.json", "tsconfig.json"];
let failed = false;

for (const relPath of files) {
  const text = readFileSync(resolve(relPath), "utf8");
  if (text.includes("\t")) {
    console.error(`[lint] tab character found in ${relPath}`);
    failed = true;
  }
}

if (failed) {
  process.exitCode = 1;
} else {
  console.log("Lint baseline checks passed.");
}
