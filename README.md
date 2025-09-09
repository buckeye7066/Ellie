# Ellie

Interactive desktop avatar that can remember, learn, and control apps on your laptop.

## Build

### Backend
1. Install JDK 11+ and Kotlin/Gradle tooling.
2. Compile the Kotlin sources:
   ```bash
   ./gradlew build
   ```
   This produces a JVM artifact containing the core and audio modules.

### Front-end assets
The Electron shell expects a built web UI from `apps/ellie-web`.
Clone and build the web client next to this repository:
```bash
git clone <ellie-web-repo-url> apps/ellie-web
cd apps/ellie-web
npm install
npm run build
```
The build output at `apps/ellie-web/dist` is loaded by Electron in production mode.

### Electron
Install dependencies and start the desktop app:
```bash
cd electron
npm install
npx tsc
npx electron .
```
During development you can run the web client with its dev server and Electron will load it from `http://localhost:5173`.
