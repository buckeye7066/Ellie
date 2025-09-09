# Ellie Voice Assistant Setup Guide

## Prerequisites

- Node.js 18+ and pnpm 8+
- Windows 10/11 (for desktop app)
- Android device (for mobile app)
- HeyGen API key
- OpenAI API key
- Bible API key (optional)

## Quick Start

1. **Clone and install dependencies:**

   ```bash
   git clone <repository-url>
   cd ellie-voice-assistant
   pnpm install:all
   ```

2. **Set up environment variables:**

   ```bash
   cp env.example .env
   # Edit .env with your API keys
   ```

3. **Start development:**

   ```bash
   pnpm dev:all
   ```

## Windows Desktop Setup

### Requirements

- Windows 10/11 (64-bit)
- Microsoft Visual Studio C++ Build Tools
- Rust toolchain (installed automatically by Tauri)

### Build and Run

```bash
# Build web app first
pnpm build:web

# Build desktop app
pnpm build:desktop

# The .msi installer will be in apps/ellie-desktop/src-tauri/target/release/bundle/msi/
```

### First Run (Android)

1. Run the installer (.msi file)
2. Launch Ellie from Start Menu
3. Complete the Setup Wizard:
   - Enter API keys
   - Choose HeyGen avatar and voice
   - Test microphone and speakers
   - Grant necessary permissions

### Settings Location (Android)

- **Settings**: `%APPDATA%/Ellie/settings.json`
- **Database**: `%APPDATA%/Ellie/ellie.db`
- **Logs**: `%APPDATA%/Ellie/logs/`

## Android Setup

### Requirements (Android)

- Android 8.0+ (API level 26+)
- Android Studio with Kotlin support
- Gradle 8.0+

### Build and Install

```bash
# Build web app for Android
pnpm build:android:web

# Build Android APK
pnpm build:android

# Install on connected device
cd apps/ellie-android
./gradlew installDebug
```

### First Run

1. Install the APK on your device
2. Grant microphone and storage permissions
3. Complete the Setup Wizard (same as desktop)
4. Test wake word and push-to-talk

### Settings Location

- **Settings**: Encrypted SharedPreferences
- **Database**: `/data/data/org.ellie.assistant/databases/ellie.db`
- **Logs**: Internal app storage

## API Service Setup

### Local Development

```bash
cd apps/ellie-api
pnpm dev
```

### Production with Docker

```bash
cd infra
docker-compose up -d
```

### Database Setup

```bash
# Seed owner account
pnpm seed:owner

# Check API health
curl http://localhost:3001/health
```

## Troubleshooting

### Common Issues

**Desktop:**

- Mic permissions: Check Windows Privacy Settings > Microphone
- Build errors: Ensure Rust toolchain is installed
- Tauri build fails: Run `pnpm build:web` first

**Android:**

- Gradle sync fails: Update Android Studio and Gradle
- Compose errors: Ensure Kotlin 2.0+ and latest Compose
- Permission denied: Grant all requested permissions

**API:**

- Database connection: Check PostgreSQL is running
- Port conflicts: Change `ELLIE_API_PORT` in .env
- CORS errors: Verify frontend URL in CORS config

### Getting Help

1. Check the logs in the respective locations
2. Verify API keys are correct
3. Ensure all services are running
4. Check network connectivity for API calls

## Next Steps

After setup:

1. Customize your avatar and voice in Settings
2. Test all skills (reminders, weather, Bible, etc.)
3. Configure wake word sensitivity
4. Set up device-specific integrations
5. Explore the admin panel for advanced features
