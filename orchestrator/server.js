import express from "express";
import { json } from "express";

import { memoryRouter } from "./src/routes/memory.js";
import { fileRouter } from "./src/routes/file.js";
import { internetRouter } from "./src/routes/internet.js";
import { pluginRouter } from "./src/routes/plugins.js";

const app = express();
app.use(json({ limit: "10mb" }));

app.get("/status", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/memory", memoryRouter);
app.use("/file", fileRouter);
app.use("/internet", internetRouter);
app.use("/plugins", pluginRouter);

const PORT = Number(process.env.ELLIE_ORCH_PORT || 3005);
app.listen(PORT, () => {
  console.log(`[Ellie Orchestrator] listening on http://localhost:${PORT}`);
});
