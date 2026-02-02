import { Router } from "express";
import { loadPlugins } from "../services/plugins.js";

export const pluginRouter = Router();

pluginRouter.get("/", (_req, res) => {
  const plugins = loadPlugins().map((p) => ({
    name: p.name,
    description: p.description || "", 
  }));
  res.json({ plugins });
});

pluginRouter.post("/:name", async (req, res) => {
  const name = req.params.name;
  const plugins = loadPlugins();
  const plugin = plugins.find((p) => p.name === name);
  if (!plugin) return res.status(404).json({ error: "plugin not found" });

  try {
    const result = await plugin.run(req.body || {});
    res.json({ ok: true, result });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
});