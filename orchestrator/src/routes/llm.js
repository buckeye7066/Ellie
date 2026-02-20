import { Router } from "express";

export const llmRouter = Router();

llmRouter.post("/chat", async (req, res) => {
  const { messages, model } = req.body || {};
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: "messages must be an array" });
  }

  const chosenModel = model || process.env.OLLAMA_MODEL || "llama3.2";

  try {
    const ollamaRes = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: chosenModel, messages, stream: false, format: "json" }),
    });
    if (!ollamaRes.ok) {
      const errData = await ollamaRes.json().catch(() => ({}));
      return res.status(500).json({ error: errData.error || `Ollama error: ${ollamaRes.status}` });
    }
    const data = await ollamaRes.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
});
