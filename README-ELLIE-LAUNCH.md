# Ellie One-Click Launcher

This adds a silent Windows launcher that brings up the Ellie stack (Gateway 3000, API 3001, Web 3002) and opens the UI in your default browser without extra terminal windows.

## Start

- Double-click the "Ellie" desktop icon, or
- Run:

```bash
pnpm ellie:start
```

## Stop

- Run the PowerShell stop script:

```bash
tools\\EllieStop.ps1
```

- Or via pnpm:

```bash
pnpm ellie:stop
```

## Default URL

- Web (Vite): `http://localhost:3002`

## Logs and PID file

- Folder: `.ellie/`
  - `api.log`, `gateway.log`, `web.log`
  - `.pids.json` for idempotent start/stop

## Shortcut creation

Create the desktop shortcut once:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force
.\\tools\\Create-Ellie-Shortcut.ps1
```

## Health and startup

- The launcher waits for:
  - `tcp:3001` (API), `tcp:3000` (Gateway), then `http://localhost:3002` (Web)
- On success, your default browser opens to the web UI.

## Troubleshooting

- Port busy: if any of 3000/3001 are occupied, the launcher exits with a clear message; run `pnpm ellie:stop` and retry.
- Timeout: if Web (3002) is not healthy within 90s, the launcher prints the last ~200 lines from each service log and exits.
