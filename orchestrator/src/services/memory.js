import fs from "fs/promises";
import path from "path";

const dbFile =
  process.env.ELLIE_MEMORY_FILE ||
  path.join(process.cwd(), "ellie.memory.json");

async function readDB() {
  try {
    const raw = await fs.readFile(dbFile, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function writeDB(data) {
  await fs.writeFile(dbFile, JSON.stringify(data, null, 2), "utf-8");
}

export async function remember(key, value) {
  const db = await readDB();
  db[key] = value;
  await writeDB(db);
}

export async function recall(key) {
  const db = await readDB();
  return db[key];
}