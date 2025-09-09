# Ellie Voice Assistant Privacy Policy

## Data Collection & Storage

### What We Collect

- **Voice Commands**: Processed for skill execution, not stored permanently
- **Settings**: Your avatar preferences, API keys, and device configuration
- **Memories**: Notes and reminders you explicitly ask Ellie to remember
- **Usage Analytics**: Basic telemetry (disabled by default)

### What We DON'T Collect

- **Personal Conversations**: Voice data is processed in real-time only
- **Biometric Data**: No voice fingerprinting or identification
- **Location Data**: Only when explicitly requested for weather/skills
- **Third-party Data**: We don't share your data with external services

## Data Storage

### Local Storage

- **Settings**: Stored locally on your device
- **Database**: SQLite database with your memories and notes
- **API Keys**: Encrypted using platform-specific security (DPAPI on Windows, EncryptedSharedPreferences on Android)

### Cloud Storage

- **HeyGen**: Avatar and voice synthesis (your text only)
- **OpenAI**: Speech-to-text and language processing
- **Bible API**: Scripture lookups when requested

## Security Measures

### Encryption

- **At Rest**: All local data encrypted using platform encryption
- **In Transit**: HTTPS/TLS for all API communications
- **API Keys**: Stored using OS-level secure storage

### Access Control

- **Superadmin**: Dr. John White has full system access
- **User Data**: Isolated per device, no cross-device sharing
- **API Limits**: Rate limiting and abuse prevention

## Data Retention

### Voice Data

- **Processing**: Real-time only, not stored
- **Logs**: Temporary for debugging, auto-deleted after 24 hours

### User Data

- **Memories**: Kept until manually deleted
- **Settings**: Persisted across app restarts
- **Logs**: Configurable retention (default: 30 days)

## Third-Party Services

### HeyGen

- **Purpose**: AI avatar generation and voice synthesis
- **Data Shared**: Text content for speech synthesis
- **Privacy**: Subject to HeyGen's privacy policy

### OpenAI

- **Purpose**: Speech recognition and language understanding
- **Data Shared**: Audio clips and text queries
- **Privacy**: Subject to OpenAI's privacy policy

### Bible API

- **Purpose**: Scripture lookups and verse retrieval
- **Data Shared**: Search queries only
- **Privacy**: No personal data transmitted

## Your Rights

### Access

- View all stored memories and notes
- Export your data in JSON format
- Access logs and system information

### Control

- Delete specific memories or all data
- Disable telemetry and analytics
- Choose which skills are active
- Control wake word sensitivity

### Deletion

- Clear all memories: Settings > Memory > Clear All
- Reset to factory defaults: Admin > Reset System
- Uninstall app: Removes all local data

## Children's Privacy

- **Age Requirement**: 13+ years old
- **Parental Consent**: Required for users under 18
- **Content Filtering**: Faithful mode available for family use
- **No Tracking**: No targeted advertising or profiling

## Compliance

### GDPR

- Right to access, rectification, and erasure
- Data portability and processing restrictions
- Consent management and withdrawal

### CCPA

- Right to know what data is collected
- Right to delete personal information
- Right to opt-out of data sharing

### HIPAA

- **Not Applicable**: Ellie is not a medical device
- **No PHI**: We don't process health information
- **General Purpose**: Intended for general assistance only

## Contact Information

### Privacy Officer

- **Name**: Dr. John White
- **Email**: <privacy@ellie-voice.com>
- **Response Time**: Within 48 hours

### Data Protection Officer

- **Contact**: <dpo@ellie-voice.com>
- **Compliance**: GDPR, CCPA, COPPA

## Updates

- **Policy Changes**: Notified via app notification
- **Version History**: Available in Settings > Privacy
- **Effective Date**: Last updated automatically

## Emergency Contact

For urgent privacy or security concerns:

- **Security**: <security@ellie-voice.com>
- **24/7 Hotline**: +1-800-ELLIE-HELP
- **Response**: Immediate for security incidents

---

*This privacy policy is effective as of the app installation date and applies to all Ellie Voice Assistant installations.*
