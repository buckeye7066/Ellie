import fs from "fs";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pluginsDir = path.join(process.cwd(), "orchestrator", "plugins");

export function loadPlugins() {
  if (!fs.existsSync(pluginsDir)) return [];
  const files = fs.readdirSync(pluginsDir).filter((f) => f.endsWith(".cjs"));

  return files
    .map((f) => {
      const mod = require(path.join(pluginsDir, f));
      return { name: mod?.name, description: mod?.description, run: mod?.run };
    })
    .filter((p) => p?.name && typeof p.run === "function");
}
