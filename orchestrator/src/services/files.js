import fs from "fs/promises";
import path from "path";

const baseDir = process.env.ELLIE_BASE_DIR || process.cwd();

function safeResolve(rel = ".") {
  const resolved = path.resolve(baseDir, rel);
  const base = path.resolve(baseDir);
  if (!resolved.startsWith(base)) throw new Error("Path escape blocked");
  return resolved;
}

export async function listDir(dir) {
  const abs = safeResolve(dir);
  const entries = await fs.readdir(abs, { withFileTypes: true });
  return entries.map((e) => ({
    name: e.name,
    type: e.isDirectory() ? "dir" : "file",
  }));
}

export async function readTextFile(relPath) {
  const abs = safeResolve(relPath);
  return fs.readFile(abs, "utf-8");
}

export async function writeTextFile(relPath, content) {
  const abs = safeResolve(relPath);
  await fs.mkdir(path.dirname(abs), { recursive: true });
  await fs.writeFile(abs, content ?? "", "utf-8");
}