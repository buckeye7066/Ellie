import { Router } from "express";
import { remember, recall } from "../services/memory.js";

export const memoryRouter = Router();

memoryRouter.post("/remember", async (req, res) => {
  const { key, value } = req.body || {};
  if (!key) return res.status(400).json({ error: "key is required" });
  await remember(String(key), value);
  res.json({ ok: true });
});

memoryRouter.get("/recall/:key", async (req, res) => {
  const key = req.params.key;
  const value = await recall(key);
  res.json({ key, value });
});
