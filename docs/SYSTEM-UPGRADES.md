# System Upgrade Guide

This guide provides step-by-step instructions for upgrading and enhancing the Grump system.

## Table of Contents

1. [Quick Upgrade Checklist](#quick-upgrade-checklist)
2. [Adding New Features](#adding-new-features)
3. [Upgrading Dependencies](#upgrading-dependencies)
4. [Database Migrations](#database-migrations)
5. [API Versioning](#api-versioning)
6. [Deployment Upgrades](#deployment-upgrades)

---

## Quick Upgrade Checklist

Before upgrading, ensure you:

- [ ] Have a backup of your current system
- [ ] Have committed all current changes to version control
- [ ] Tested changes in a development environment
- [ ] Updated documentation
- [ ] Notified users if breaking changes are expected

---

## Adding New Features

### 1. Feature Planning

Document your feature in `docs/FEATURES/` before implementation:

```markdown
# Feature: [Feature Name]

## Description
Brief description of what this feature does.

## Implementation Steps
1. Step one
2. Step two
3. Step three

## Testing Requirements
- Test case 1
- Test case 2

## Breaking Changes
None / List any breaking changes
```

### 2. Code Structure

Follow the existing project structure:
- **Backend**: `backend/services/`, `backend/routes/`
- **iOS**: `ios/Grump/Services/`, `ios/Grump/Models/`
- **Web**: `web/src/components/`, `web/src/services/`
- **Mobile**: `mobile/components/`, `mobile/store/`

### 3. Testing

- Write tests for new features
- Test across all platforms (iOS, Web, Mobile)
- Verify backward compatibility

---

## Upgrading Dependencies

### Backend Dependencies

1. **Check current versions**:
   ```bash
   cd backend
   npm outdated
   ```

2. **Update package.json** (or use npm update):
   ```bash
   npm update
   ```

3. **Update major versions carefully**:
   ```bash
   npm install package@latest
   ```

4. **Test thoroughly** after updates

5. **Common packages to monitor**:
   - `express` - Web framework
   - `@anthropic-ai/sdk` - Anthropic API
   - `axios` - HTTP client

### iOS Dependencies

1. **Check for updates**:
   - Open project in Xcode
   - Go to File → Packages → Update to Latest Package Versions

2. **Update Swift Package Manager dependencies**:
   ```swift
   // In Package.swift or Xcode Package Dependencies
   ```

### Web Dependencies

1. **Check and update**:
   ```bash
   cd web
   npm outdated
   npm update
   ```

2. **Common packages**:
   - `react` / `react-dom`
   - `vite`
   - `typescript`

### Mobile (React Native) Dependencies

1. **Check Expo SDK version**:
   ```bash
   cd mobile
   npx expo install --check
   ```

2. **Update Expo SDK** (if needed):
   ```bash
   npx expo upgrade
   ```

---

## Database Migrations

### iOS (SwiftData)

SwiftData handles schema changes automatically, but you should:

1. **Add new properties** with default values for existing data:
   ```swift
   @Model
   final class Message {
       var content: String
       var sender: MessageSender
       var timestamp: Date
       var editedAt: Date? = nil  // New optional property
   }
   ```

2. **Version your schema** (if using migration):
   ```swift
   // In GrumpApp.swift
   let configuration = ModelConfiguration(
       schema: Schema([ChatSession.self, Message.self]),
       isStoredInMemoryOnly: false
   )
   ```

3. **Test migrations** with existing data

### Web (LocalStorage)

1. **Version your data structure**:
   ```typescript
   interface ChatHistory {
       version: string;  // Add version field
       messages: Message[];
   }
   ```

2. **Migration function**:
   ```typescript
   function migrateChatHistory(data: any): ChatHistory {
       if (!data.version) {
           // Migrate from v1 to v2
           return {
               version: '2.0',
               messages: data.messages || []
           };
       }
       return data;
   }
   ```

---

## API Versioning

### Current API Structure

```
POST /api/chat
{
  "message": string,
  "conversationHistory": Array
}
```

### Adding API Versions

1. **Create versioned routes**:
   ```javascript
   // backend/routes/v2/chat.js
   router.post('/chat', async (req, res) => {
       // New version implementation
   });
   ```

2. **Update server.js**:
   ```javascript
   app.use('/api/v1', v1Routes);
   app.use('/api/v2', v2Routes);
   ```

3. **Maintain backward compatibility** during transition period

---

## Deployment Upgrades

### Development Environment

1. **Pull latest changes**:
   ```bash
   git pull origin main
   ```

2. **Install dependencies**:
   ```bash
   npm install  # Root
   cd backend && npm install
   cd ../web && npm install
   cd ../mobile && npm install
   ```

3. **Update environment variables**:
   - Copy `.env.example` to `.env`
   - Update with new variables

4. **Run setup scripts**:
   ```bash
   ./setup.sh  # Linux/Mac
   ./setup.ps1  # Windows
   ```

### Production Environment

1. **Create backup**:
   ```bash
   # Backup database, configuration, etc.
   ```

2. **Deploy updates**:
   ```bash
   git pull origin main
   npm install
   npm run build  # If applicable
   ```

3. **Restart services**:
   ```bash
   # Restart backend server
   pm2 restart grump-backend  # If using PM2
   ```

4. **Verify deployment**:
   - Check logs
   - Test critical functionality
   - Monitor error rates

---

## Common Upgrade Scenarios

### Scenario 1: Upgrading AI Model

1. Update model name in config:
   ```javascript
   // backend/config/config.js
   model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'
   ```

2. Update .env:
   ```env
   GROQ_MODEL=llama-3.4-70b-versatile
   ```

3. Restart backend

### Scenario 2: Adding New Platform

1. Create new platform directory structure
2. Copy base configuration from existing platform
3. Update build scripts
4. Add platform-specific dependencies
5. Update documentation

### Scenario 3: Major Version Upgrade

1. **Review breaking changes** in dependency release notes
2. **Create migration plan**
3. **Update code incrementally**
4. **Test thoroughly**
5. **Update documentation**

---

## Rollback Procedures

If an upgrade causes issues:

### Quick Rollback (Git)

```bash
git log  # Find previous working commit
git checkout <previous-commit-hash>
npm install  # Restore dependencies
```

### Database Rollback

- iOS: Restore from Time Machine / Backup
- Web: Restore localStorage from backup (if stored)

### Dependency Rollback

```bash
npm install package@previous-version
```

---

## Testing Upgrades

### Pre-Upgrade Testing

1. **Unit tests**:
   ```bash
   npm test
   ```

2. **Integration tests**:
   - Test API endpoints
   - Test database operations
   - Test UI functionality

3. **Manual testing**:
   - Test critical user flows
   - Test on all platforms

### Post-Upgrade Testing

1. **Smoke tests**:
   - Verify system starts
   - Test basic functionality

2. **Regression tests**:
   - Ensure existing features still work
   - Check for performance regressions

---

## Documentation Updates

When upgrading, update:

- [ ] README.md with new features/requirements
- [ ] CHANGELOG.md with version changes
- [ ] API documentation
- [ ] Setup/installation guides
- [ ] Environment variable documentation

---

## Upgrade Checklist Template

Copy this for each upgrade:

```markdown
## Upgrade: [Version/Feature Name]

### Date: [Date]

### Changes:
- [ ] Dependency updates
- [ ] New features added
- [ ] Bug fixes
- [ ] Breaking changes

### Testing:
- [ ] Backend tested
- [ ] iOS tested
- [ ] Web tested
- [ ] Mobile tested

### Deployment:
- [ ] Development deployed
- [ ] Production deployed
- [ ] Rollback plan ready

### Documentation:
- [ ] README updated
- [ ] CHANGELOG updated
- [ ] API docs updated
```

---

## Getting Help

If you encounter issues during upgrades:

1. Check existing documentation in `/docs`
2. Review error logs
3. Check GitHub issues (if applicable)
4. Review dependency release notes
5. Test in isolated environment

---

## Next Steps

- Set up automated testing for upgrades
- Implement CI/CD pipeline
- Create upgrade scripts for common scenarios
- Document platform-specific upgrade procedures
- Set up monitoring/alerting for upgrade issues
