import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { app, BrowserWindow, ipcMain, session } from 'electron';
import { spawn } from 'child_process';

import os from 'os';

const __filename = typeof __dirname !== 'undefined' ? '' : fileURLToPath(import.meta.url);
const __dirnameSafe = typeof __dirname !== 'undefined' ? __dirname : path.dirname(__filename);

const isDev = !app.isPackaged && process.env.APP_PROD !== '1';

// Allow autoplay and media capture in Electron (safe in app context)
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

function createWindow() {
  const preloadProd = path.join(__dirnameSafe, 'preload.js');
  const preloadExists = fs.existsSync(preloadProd);
  const webPreferences: Electron.BrowserWindowConstructorOptions['webPreferences'] = {
    contextIsolation: true,
    nodeIntegration: false,
    ...(preloadExists ? { preload: preloadProd } : {}),
  };

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#111111',
    title: 'Ellie — Avatar',
    webPreferences,
  });

  // Grant media permissions within the app session (mic/camera on request)
  try {
    session.defaultSession.setPermissionRequestHandler((_wc, permission, callback) => {
      if (permission === 'media' || permission === 'audioCapture' || permission === 'videoCapture') {
        return callback(true);
      }
      callback(false);
    });
  } catch {}

  function showLoadError(code: number, desc: string, failingUrl?: string) {
    try {
      const fallback = path.resolve(process.cwd(), 'public', 'fallback.html');
      if (fs.existsSync(fallback)) {
        win.loadFile(fallback).catch(() => {});
      } else {
        const html = `<!doctype html><meta charset="utf-8"/><body style="background:#111;color:#eee;font-family:system-ui;padding:24px"><h2>Render failed to load</h2><pre>${code}: ${desc}${failingUrl ? '\n' + failingUrl : ''}</pre></body>`;
        win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html)).catch(() => {});
      }
    } catch {}
  }

  if (isDev) {
    const devUrl = (process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173').replace(/\/?$/, '/');
    const target = devUrl + '#/avatar';
    console.log('[MAIN] DEV load:', target);
    win.loadURL(target);
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    const indexPath = path.join(__dirnameSafe, '..', 'apps', 'ellie-web', 'dist', 'index.html');
    const target = 'file://' + indexPath.replace(/\\/g, '/').replace(/^([A-Za-z]):/, '//$1:') + '#/avatar';
    console.log('[MAIN] PROD load:', target);
    win.loadURL(target).catch(err => console.error('[MAIN] loadURL error:', err));
  }

  win.webContents.on('did-fail-load', (_e, code, desc, url) => {
    console.error('[MAIN] did-fail-load', { code, desc, url });
    showLoadError(code as number, String(desc), String(url || ''));
  });
  win.webContents.on('did-finish-load', () => {
    console.log('[MAIN] did-finish-load');
    const js = "(function(){var el=document.getElementById('root'); if(el){ var hb=document.createElement('div'); hb.style.cssText='position:fixed;top:8px;left:8px;background:#0a0;color:#fff;padding:4px 8px;border-radius:6px;font:12px system-ui;z-index:99999;'; hb.textContent='HTML loaded ✔'; el.appendChild(hb); setTimeout(()=>hb.remove(), 3000); } })();";
    win.webContents.executeJavaScript(js).catch(() => {});
  });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });

// --- Simple memory store on disk ---
type MemoryRecord = { id: string; ts: number; key?: string; text?: string; data?: any };
const memoryFile = () => {
  try { return path.join(app.getPath('userData'), 'memory.json'); } catch { return path.join(os.tmpdir(), 'ellie_memory.json'); }
};
function readMem(): MemoryRecord[] {
  try { const f = memoryFile(); if (fs.existsSync(f)) return JSON.parse(fs.readFileSync(f,'utf-8')); } catch {}
  return [];
}
function writeMem(arr: MemoryRecord[]) { try { fs.mkdirSync(path.dirname(memoryFile()), { recursive: true }); fs.writeFileSync(memoryFile(), JSON.stringify(arr, null, 2)); } catch {} }

// --- Windows app control helpers (PowerShell + WScript.Shell) ---
function runPwsh(cmd: string): Promise<{ code: number|null }>{
  return new Promise((resolve)=>{
    const ps = spawn('powershell.exe', ['-NoProfile','-ExecutionPolicy','Bypass','-Command', cmd]);
    ps.on('close', (code)=> resolve({ code }));
  });
}
async function psSendKeys(keys: string) {
  const cmd = "$ws=New-Object -ComObject WScript.Shell; Start-Sleep -Milliseconds 50; $ws.SendKeys(\"" + keys.replace(/`/g,'``').replace(/"/g,'`"') + "\")";
  await runPwsh(cmd);
}
async function psActivate(winTitle: string) {
  const cmd = `$ws=New-Object -ComObject WScript.Shell; $null=$ws.AppActivate(\"${winTitle.replace(/"/g,'`"')}\")`;
  await runPwsh(cmd);
}

// --- IPC handlers ---
ipcMain.handle('agent:open', async (_e, payload: { target: string, args?: string }) => {
  const { target, args } = payload || {};
  if (!target) return { ok:false, error:'no-target' };
  // Use Start-Process to let Windows resolve paths/associations
  const a = args ? ` -ArgumentList \"${args.replace(/"/g,'`"')}\"` : '';
  await runPwsh(`Start-Process \"${target.replace(/"/g,'`"')}\"${a}`);
  return { ok:true };
});

ipcMain.handle('agent:switch', async (_e, payload: { target: string }) => {
  const { target } = payload || {};
  if (!target) return { ok:false };
  await psActivate(target);
  return { ok:true };
});

ipcMain.handle('agent:close', async (_e, payload: { process?: string, title?: string }) => {
  const { process: proc, title } = payload || {};
  if (proc) { await runPwsh(`Get-Process -Name \"${proc}\" -ErrorAction SilentlyContinue | Stop-Process -Force`); }
  if (title) { await runPwsh(`$ws=New-Object -ComObject WScript.Shell; if($ws.AppActivate(\"${title}\")){ $ws.SendKeys('%{F4}') }`); }
  return { ok:true };
});

ipcMain.handle('agent:type', async (_e, payload: { text: string }) => {
  const { text } = payload || {};
  if (!text) return { ok:false };
  await psSendKeys(text);
  return { ok:true };
});

ipcMain.handle('agent:press', async (_e, payload: { combo: string }) => {
  const { combo } = payload || {};
  if (!combo) return { ok:false };
  await psSendKeys(combo);
  return { ok:true };
});

ipcMain.handle('agent:remember', async (_e, payload: { key?: string, text?: string, data?: any }) => {
  const arr = readMem();
  const rec: MemoryRecord = { id: String(Date.now()), ts: Date.now(), ...payload };
  arr.push(rec); writeMem(arr);
  return { ok:true, id: rec.id };
});

ipcMain.handle('agent:getMemory', async () => ({ ok:true, data: readMem() }));

// --- Icon pipeline: accept data URL PNG, convert to ICO, update shortcuts
ipcMain.handle('icon:apply', async (_e, payload: { dataUrl?: string }) => {
  try {
    const dataUrl = payload?.dataUrl || '';
    const m = dataUrl.match(/^data:image\/png;base64,(.+)$/);
    if (!m) return { ok:false, error:'invalid-dataurl' };
    const buf = Buffer.from(m[1], 'base64');
    const tmpPng = path.join(app.getPath('temp'), 'ellie_icon.png');
    fs.writeFileSync(tmpPng, buf);

    const repo = path.resolve(process.cwd());
    const scriptsDir = path.join(repo, 'scripts');
    const outIco = path.join(repo, 'docs', 'icons', 'ellie.ico');
    const buildIco = path.join(repo, 'build-resources', 'icon.ico');

    // Convert using PowerShell script (no external deps)
    await runPwsh(`& \"${path.join(scriptsDir, 'png_to_ico.ps1').replace(/\\/g,'\\\\')}\" -Png \"${tmpPng.replace(/\\/g,'\\\\')}\" -Out \"${outIco.replace(/\\/g,'\\\\')}\"`);
    // Sync to build resources
    try { fs.mkdirSync(path.dirname(buildIco), { recursive:true }); fs.copyFileSync(outIco, buildIco); } catch {}
    // Update existing shortcuts
    await runPwsh(`& \"${path.join(scriptsDir, 'set_shortcut_icon.ps1').replace(/\\/g,'\\\\')}\" -IcoPath \"${outIco.replace(/\\/g,'\\\\')}\"`);
    return { ok:true, out: outIco };
  } catch (e:any) {
    return { ok:false, error: String(e?.message || e) };
  }
});


