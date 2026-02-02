import { Router } from "express";
import { searchWeb, navigate, click } from "../services/internet.js";

export const internetRouter = Router();

internetRouter.post("/search", async (req, res) => {
  const { query } = req.body || {};
  if (!query) return res.status(400).json({ error: "query is required" });
  res.json({ results: await searchWeb(String(query)) });
});

internetRouter.post("/navigate", async (req, res) => {
  const { url } = req.body || {};
  if (!url) return res.status(400).json({ error: "url is required" });
  res.json({ content: await navigate(String(url)) });
});

internetRouter.post("/click", async (req, res) => {
  const { url, selector } = req.body || {};
  if (!url || !selector)
    return res.status(400).json({ error: "url + selector required" });
  res.json({ content: await click(String(url), String(selector)) });
});
