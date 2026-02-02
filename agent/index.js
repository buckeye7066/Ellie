import fs from "fs";
import path from "path";
const folder = process.env.ELLIE_FOLDER || process.cwd();
console.log(`[Ellie Agent] Watching: ${folder}`);
fs.watch(folder, { recursive: true }, (eventType, filename) => {
    if (!filename) return;
    console.log(`[Ellie Agent] ${eventType}: ${path.join(folder, filename)}`);
});