import { Router } from "express";
import { listDir, readTextFile, writeTextFile } from "../services/files.js";

export const fileRouter = Router();

fileRouter.get("/list", async (req, res) => {
  try {
    const dir = String(req.query.dir || ".");
    const items = await listDir(dir);
    res.json({ dir, items });
  } catch (e) {
    res.status(400).json({ error: String(e.message || e) });
  }
});

fileRouter.get("/read", async (req, res) => {
  try {
    const p = req.query.path;
    if (!p) return res.status(400).json({ error: "path is required" });
    const content = await readTextFile(String(p));
    res.json({ path: String(p), content });
  } catch (e) {
    res.status(400).json({ error: String(e.message || e) });
  }
});

fileRouter.post("/write", async (req, res) => {
  try {
    const { path: p, content } = req.body || {};
    if (!p) return res.status(400).json({ error: "path is required" });
    await writeTextFile(String(p), String(content ?? ""));
    res.json({ ok: true, path: String(p) });
  } catch (e) {
    res.status(400).json({ error: String(e.message || e) });
  }
});