"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
let mainWin = null;
let pendingDeepLink = null;
electron_1.app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");
electron_1.app.disableHardwareAcceleration();
function getLogFile() {
    try {
        const dir = electron_1.app.getPath('userData');
        return node_path_1.default.join(dir, 'ellie.log');
    }
    catch {
        return node_path_1.default.join(process.cwd(), 'ellie.log');
    }
}
function log(message) {
    const line = `[${new Date().toISOString()}] ${message}\n`;
    try {
        node_fs_1.default.appendFileSync(getLogFile(), line);
    }
    catch { }
    try {
        console.log(line.trim());
    }
    catch { }
}
// Early diagnostics
process.on('uncaughtException', (err) => {
    try {
        log(`uncaughtException: ${err?.stack || err}`);
    }
    catch { }
});
process.on('unhandledRejection', (reason) => {
    try {
        log(`unhandledRejection: ${reason?.stack || reason}`);
    }
    catch { }
});
try {
    log('boot: main module loaded');
}
catch { }
function createWindow() {
    log(`createWindow: __dirname=${__dirname}`);
    mainWin = new electron_1.BrowserWindow({
        width: 1100, height: 760,
        title: 'Ellie Voice Assistant',
        backgroundColor: '#0b0b10',
        autoHideMenuBar: true,
        webPreferences: {
            preload: node_path_1.default.join(__dirname, "preload.js"),
            contextIsolation: true, nodeIntegration: false, sandbox: true
        }
    });
    electron_1.session.defaultSession.setPermissionRequestHandler((wc, permission, cb) => {
        if (permission === "media") {
            try {
                const url = wc.getURL();
                const allow = url.startsWith("http://localhost:3005") || url.startsWith("file://");
                return cb(allow);
            }
            catch {
                return cb(false);
            }
        }
        cb(false);
    });
    const dev = process.env.VITE_DEV_SERVER_URL;
    if (dev) {
        log(`DEV mode: loading ${dev}`);
        mainWin.loadURL(dev).catch(err => log(`loadURL error: ${err?.message || err}`));
    }
    else {
        const indexPath = node_path_1.default.join(__dirname, "..", "index.html");
        const exists = node_fs_1.default.existsSync(indexPath);
        log(`PROD mode: loading file://${indexPath} exists=${exists}`);
        if (!exists) {
            // Log directory listing to help debug packaging
            try {
                const parent = node_path_1.default.join(__dirname, '..');
                const items = node_fs_1.default.readdirSync(parent).join(',');
                log(`dist parent contents: ${parent} -> [${items}]`);
            }
            catch { }
        }
        mainWin.loadFile(indexPath).then(() => {
            log('loadFile success');
        }).catch(err => log(`loadFile error: ${err?.message || err}`));
    }
    mainWin.webContents.on('did-finish-load', () => log('did-finish-load'));
    mainWin.webContents.on('did-fail-load', (_e, code, desc, url, isMainFrame) => {
        log(`did-fail-load code=${code} desc=${desc} url=${url} mainFrame=${isMainFrame}`);
    });
    mainWin.webContents.on('render-process-gone', (_e, details) => {
        log(`render-process-gone: reason=${details.reason} exitCode=${details.exitCode}`);
    });
    mainWin.on("closed", () => (mainWin = null));
}
function handleDeepLink(url) {
    // ellie://open or ellie://open?from=web
    if (!mainWin)
        createWindow();
    if (mainWin) {
        mainWin.show();
        mainWin.focus();
    }
}
const gotLock = electron_1.app.requestSingleInstanceLock();
if (!gotLock)
    electron_1.app.quit();
else {
    electron_1.app.on("second-instance", (_e, argv) => {
        const deeplink = argv.find(a => a.startsWith("ellie://"));
        if (deeplink)
            handleDeepLink(deeplink);
        if (mainWin) {
            mainWin.show();
            mainWin.focus();
        }
    });
    electron_1.app.whenReady().then(() => {
        log('app.whenReady');
        // Register protocol (packaged). For dev, see note below.
        electron_1.app.setAsDefaultProtocolClient("ellie");
        electron_1.app.setLoginItemSettings({ openAtLogin: true, openAsHidden: false }); // auto-launch on login
        createWindow();
        if (pendingDeepLink) {
            handleDeepLink(pendingDeepLink);
            pendingDeepLink = null;
        }
    });
}
// macOS open-url; on Windows deep-link arrives in process.argv
electron_1.app.on("open-url", (_e, url) => {
    if (electron_1.app.isReady())
        handleDeepLink(url);
    else
        pendingDeepLink = url;
});
electron_1.app.on("window-all-closed", () => { log('window-all-closed'); if (process.platform !== "darwin")
    electron_1.app.quit(); });
electron_1.app.on("activate", () => { if (!mainWin)
    createWindow(); });
// @ts-ignore Electron types may not include this event in this version
electron_1.app.on('gpu-process-crashed', (_e, killed) => { log(`gpu-process-crashed killed=${killed}`); });
/*
DEV NOTE (Windows):
During dev, set default protocol with arguments:
app.setAsDefaultProtocolClient("ellie", process.execPath, [path.join(process.cwd(), "node_modules", ".bin", "electron")]);
Use packaged build for most reliable behavior.
*/
