import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { app, BrowserWindow } from 'electron';
const __filename = typeof __dirname !== 'undefined' ? '' : fileURLToPath(import.meta.url);
const __dirnameSafe = typeof __dirname !== 'undefined' ? __dirname : path.dirname(__filename);
const isDev = !app.isPackaged && process.env.APP_PROD !== '1';
function createWindow() {
    const preloadProd = path.join(__dirnameSafe, 'preload.js');
    const preloadExists = fs.existsSync(preloadProd);
    const webPreferences = {
        contextIsolation: true,
        nodeIntegration: false,
        ...(preloadExists ? { preload: preloadProd } : {}),
    };
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        backgroundColor: '#111111',
        webPreferences,
    });
    function showLoadError(code, desc, failingUrl) {
        try {
            const fallback = path.resolve(process.cwd(), 'public', 'fallback.html');
            if (fs.existsSync(fallback)) {
                win.loadFile(fallback).catch(() => { });
            }
            else {
                const html = `<!doctype html><meta charset="utf-8"/><body style="background:#111;color:#eee;font-family:system-ui;padding:24px"><h2>Render failed to load</h2><pre>${code}: ${desc}${failingUrl ? '\n' + failingUrl : ''}</pre></body>`;
                win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html)).catch(() => { });
            }
        }
        catch { }
    }
    if (isDev) {
        const devUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
        console.log('[MAIN] DEV load:', devUrl);
        win.loadURL(devUrl);
        win.webContents.openDevTools({ mode: 'detach' });
    }
    else {
        const indexPath = path.join(__dirnameSafe, '..', 'apps', 'ellie-web', 'dist', 'index.html');
        console.log('[MAIN] PROD load:', indexPath);
        win.loadFile(indexPath).catch(err => console.error('[MAIN] loadFile error:', err));
    }
    win.webContents.on('did-fail-load', (_e, code, desc, url) => {
        console.error('[MAIN] did-fail-load', { code, desc, url });
        showLoadError(code, String(desc), String(url || ''));
    });
    win.webContents.on('did-finish-load', () => {
        console.log('[MAIN] did-finish-load');
        const js = "(function(){var el=document.getElementById('root'); if(el){ var hb=document.createElement('div'); hb.style.cssText='position:fixed;top:8px;left:8px;background:#0a0;color:#fff;padding:4px 8px;border-radius:6px;font:12px system-ui;z-index:99999;'; hb.textContent='HTML loaded ✔'; el.appendChild(hb); setTimeout(()=>hb.remove(), 3000); } })();";
        win.webContents.executeJavaScript(js).catch(() => { });
    });
}
app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin')
    app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0)
    createWindow(); });
