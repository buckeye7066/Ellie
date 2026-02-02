# Ellie Operator Core (Local Orchestrator)

This adds a local operator service that can: remember/recall key-values, read/write files (scoped to ELLIE_BASE_DIR), browse the internet (search/navigate/click) using Playwright, run offline plugins (local modules from disk).

Run:

npm install, npm run orchestrator:dev, npm run dev:web.

Environment (recommended):

ELLIE_BASE_DIR="C:\Users\<you>\Documents\EllieWorkspace",
ELLIE_ORCH_PORT=3005.

Quick test (PowerShell):

Invoke-RestMethod http://localhost:3005/status