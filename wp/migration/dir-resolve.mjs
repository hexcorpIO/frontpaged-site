// Node's ESM loader will not resolve a directory import ("./verticals") or an
// extensionless one ("./pricing"); the bundler that builds the site resolves
// both. Rather than rewrite application imports to suit a one-off migration
// script, this hook teaches the loader the same rules the bundler applies —
// including the "@/" alias from tsconfig.
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const ROOT = process.cwd();
const EXTENSIONS = [".ts", ".tsx", ".mjs", ".js"];
const INDEXES = EXTENSIONS.map((e) => `index${e}`);

function firstExisting(base, candidates) {
  for (const c of candidates) {
    const file = path.join(base, c);
    if (existsSync(file)) return pathToFileURL(file).href;
  }
  return null;
}

export async function resolve(specifier, context, next) {
  // "@/lib/x" -> "<root>/src/lib/x", matching tsconfig paths.
  if (specifier.startsWith("@/")) {
    specifier = pathToFileURL(path.join(ROOT, "src", specifier.slice(2))).href;
  }

  try {
    return await next(specifier, context);
  } catch (error) {
    const code = error?.code;
    if (code !== "ERR_UNSUPPORTED_DIR_IMPORT" && code !== "ERR_MODULE_NOT_FOUND") throw error;

    const target = error.url
      ? fileURLToPath(error.url)
      : path.resolve(path.dirname(fileURLToPath(context.parentURL ?? import.meta.url)), specifier);

    const resolved = existsSync(target) && !path.extname(target)
      ? firstExisting(target, INDEXES)                                   // directory
      : firstExisting(path.dirname(target), EXTENSIONS.map((e) => path.basename(target) + e))
        ?? firstExisting(target, INDEXES);                               // extensionless file

    if (resolved) return next(resolved, context);
    throw error;
  }
}
