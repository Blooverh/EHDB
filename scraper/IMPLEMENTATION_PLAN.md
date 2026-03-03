# EHDB AI-Enhanced Web Scraper Implementation Plan

## ⚠️ New Project - Separate Directory

This scraper will be created as a **separate project**:

```
/Users/blooverh/Desktop/ehdb-scraper/    ← NEW PROJECT
/Users/blooverh/Desktop/EHDB/            ← Existing web app (keep as-is)
```

The new scraper connects to the **same MongoDB database** used by the web app.

---

## Architecture

```
ehdb-scraper/              ← NEW PROJECT (separate from web app)
├── core/
├── services/
├── scrapers/
├── scheduler/
├── config/
├── models/                 ← COPIED from existing scraper
│   ├── cpu.js
│   └── server.js
└── main.js
```

**Models:** Copy `models/cpu.js` and `models/server.js` from existing scraper. They connect to the same MongoDB.

---

## Overview

Transform existing scraper into an AI-enhanced, automated system.

### Core Philosophy

- **Two-Tier Scraping:** Discovery (AI-powered, one-time) + Price Update (weekly)
- **Smart Automation:** Auto-discovery, AI matching, high-traffic skip

### Key Requirements

| Requirement       | Implementation                      |
| ----------------- | ----------------------------------- |
| Schedule          | Every Saturday at 2 AM              |
| AI Matching       | Configurable (`config/settings.js`) |
| Hosting           | Standalone Node.js process          |
| Notifications     | Console logs                        |
| High-Traffic Skip | Enabled (>50% = skip)               |
| Data Retention    | Keep previous price                 |

---

## Workflow

```
SCHEDULER (Saturday 2AM, skip if high-traffic)
         │
         ▼
  1. PRICE UPDATE PHASE
     - Scrape listing pages
     - Match by brand + normalized model
     - AI fallback for uncertain matches
     - Update prices / queue new for discovery
         │
         ▼
  2. AUTO DISCOVERY PHASE
     - Visit detail pages
     - AI extract specifications
     - Create/update products
         │
         ▼
  3. NOTIFICATION PHASE
     - Log new products, price changes, errors
```

---

## Reuse Strategy

### ✅ Reusable (No Changes)

- `models/cpu.js` - Already has `info` array with price tracking
- `models/server.js` - Already has `chassisInfo` for prices
- Dependencies: mongoose, puppeteer, slugify, dotenv, commander

### 🔄 Requires Adaptation

| Old File                                | New Location                        |
| --------------------------------------- | ----------------------------------- |
| `lib/DB_utilities/cpuDataHandlers/*.js` | `services/ProductMatcher.js`        |
| `scrapers/cpuCollectionScraper/*.js`    | `scrapers/priceUpdater/*.js`        |
| `scrapers/serverCollectionScraper/*.js` | `scrapers/priceUpdater/*Server*.js` |

### 🆕 Must Create

- `config/settings.js`
- `core/BaseScraper.js`, `BrowserManager.js`, `RetryManager.js`
- `services/AIExtractor.js`, `NotificationService.js`, `DiscoveryLogger.js`
- `scheduler/cron-jobs.js`, `SystemMonitor.js`
- `scrapers/discovery/*.js`

---

## File Mapping

| Old File                                                 | New File                                             | Status          |
| -------------------------------------------------------- | ---------------------------------------------------- | --------------- |
| `scrapers/cpuCollectionScraper/cnCpuScraper.js`          | `scrapers/priceUpdater/CloudNinjasPriceUpdater.js`   | Adapt           |
| `scrapers/cpuCollectionScraper/xByteCpuScraper.js`       | `scrapers/priceUpdater/XBytePriceUpdater.js`         | Adapt           |
| `scrapers/cpuCollectionScraper/sMonkeyScraper.js`        | `scrapers/priceUpdater/ServerMonkeyPriceUpdater.js`  | Adapt           |
| `scrapers/serverCollectionScraper/cnServerScraper.js`    | `scrapers/priceUpdater/CloudNinjasServerUpdater.js`  | Adapt           |
| `scrapers/serverCollectionScraper/smServerScraper.js`    | `scrapers/priceUpdater/ServerMonkeyServerUpdater.js` | Adapt           |
| `scrapers/serverCollectionScraper/xByteServerScraper.js` | `scrapers/priceUpdater/XByteServerUpdater.js`        | Adapt           |
| `lib/DB_utilities/cpuDataHandlers/cpu_*.js`              | `services/ProductMatcher.js`                         | Extract & merge |
| `main.js`                                                | `main.js`                                            | Replace         |

---

## Implementation Phases

### Phase 1: Foundation

| Task              | Files                    | Effort  |
| ----------------- | ------------------------ | ------- |
| Config & Settings | `config/settings.js`     | 1 hour  |
| Base Scraper      | `core/BaseScraper.js`    | 2 hours |
| Browser Manager   | `core/BrowserManager.js` | 2 hours |
| Retry Manager     | `core/RetryManager.js`   | 1 hour  |
| package.json      | Add node-cron, fuse.js   | 15 min  |

### Phase 2: Core Services

| Task                 | Files                             | Effort  |
| -------------------- | --------------------------------- | ------- |
| Notification Service | `services/NotificationService.js` | 1 hour  |
| Discovery Logger     | `services/DiscoveryLogger.js`     | 1 hour  |
| Product Matcher      | `services/ProductMatcher.js`      | 3 hours |

### Phase 3: AI Integration

| Task         | Files                                 | Effort  |
| ------------ | ------------------------------------- | ------- |
| AI Extractor | `services/AIExtractor.js`             | 4 hours |
| AI Matching  | `services/ProductMatcher.js` (update) | 2 hours |

### Phase 4: Price Updaters (CPU)

| Task          | Files                                               | Effort  |
| ------------- | --------------------------------------------------- | ------- |
| Cloud Ninjas  | `scrapers/priceUpdater/CloudNinjasPriceUpdater.js`  | 2 hours |
| XByte         | `scrapers/priceUpdater/XBytePriceUpdater.js`        | 2 hours |
| Server Monkey | `scrapers/priceUpdater/ServerMonkeyPriceUpdater.js` | 2 hours |

### Phase 5: Price Updaters (Server)

| Task                 | Files                                                | Effort  |
| -------------------- | ---------------------------------------------------- | ------- |
| Cloud Ninjas Server  | `scrapers/priceUpdater/CloudNinjasServerUpdater.js`  | 2 hours |
| XByte Server         | `scrapers/priceUpdater/XByteServerUpdater.js`        | 2 hours |
| Server Monkey Server | `scrapers/priceUpdater/ServerMonkeyServerUpdater.js` | 2 hours |

### Phase 6: Discovery Scrapers

| Task          | Files                                         | Effort  |
| ------------- | --------------------------------------------- | ------- |
| Cloud Ninjas  | `scrapers/discovery/CloudNinjasDiscovery.js`  | 3 hours |
| XByte         | `scrapers/discovery/XByteDiscovery.js`        | 3 hours |
| Server Monkey | `scrapers/discovery/ServerMonkeyDiscovery.js` | 3 hours |

### Phase 7: Scheduler & Main

| Task           | Files                        | Effort  |
| -------------- | ---------------------------- | ------- |
| Cron Jobs      | `scheduler/cron-jobs.js`     | 2 hours |
| System Monitor | `scheduler/SystemMonitor.js` | 1 hour  |
| Main Entry     | `main.js`                    | 2 hours |

### Phase 8: Database & Testing

| Task                | Files                               | Effort  |
| ------------------- | ----------------------------------- | ------- |
| Add metadata fields | `models/cpu.js`, `models/server.js` | 30 min  |
| Migration Script    | `scripts/migrate-existing-data.js`  | 2 hours |
| Tests               | `tests/*.test.js`                   | 4 hours |

---

## Configuration

```javascript
// config/settings.js
export default {
  schedule: {
    priceUpdate: "0 2 * * 6", // Saturday 2 AM
    skipHighTraffic: true,
    highTrafficThreshold: 50,
  },
  ai: {
    enabled: true,
    matching: true,
    extraction: true,
    provider: "opencode",
    model: "opencode/minimax-m2.1-free",
    baseUrl: process.env.LLM_BASE_URL || "https://api.opencode.ai/v1",
  },
  scraping: {
    headless: true,
    timeout: 60000,
    minDelay: 2000,
    maxDelay: 5000,
  },
  logging: {
    level: "info",
    discovery: { enabled: true, directory: "logs/discovery" },
  },
  database: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/ehdb",
  },
};
```

---

## Dependencies

```json
{
  "dependencies": {
    "node-cron": "^3.0.3",
    "fuse.js": "^7.0.0"
  }
}
```

Existing dependencies (mongoose, puppeteer, slugify, dotenv, commander) are already in package.json.

---

## Usage

```bash
# Development
node main.js

# Manual commands
node main.js price:update --vendor cloudninjas
node main.js discovery:run
node main.js full:pipeline

# Production
pm2 start main.js --name ehdb-scraper
pm2 logs ehdb-scraper
```

---

## Migration Path

1. **Parallel Development** - Create new scraper alongside existing (same DB)
2. **Testing (2-4 weeks)** - Compare data quality
3. **Switchover** - Stop old scraper, verify new works
4. **Cleanup** - Remove old files (optional)

**Rollback:** Keep old `main.js` as `main-legacy.js`

---

## Database Schema Update

Add to `models/cpu.js` and `models/server.js`:

```javascript
metadata: {
  discoveryDate: Date,
  lastPriceUpdate: Date,
  discoverySource: String,
  needsReDiscovery: { type: Boolean, default: false }
}
```

---

## Hosting & Deployment

### Phase 1-8: Local Development (Primary)

Run locally on your machine for development and testing:

```bash
node main.js
# or with PM2
pm2 start main.js --name ehdb-scraper
```

### Phase 9: Home Server Deployment

After local testing is complete, deploy to your home server:

1. **Install Docker on home server** (once):

   ```bash
   curl -fsSL https://get.docker.com | sh
   sudo usermod -aG docker $USER
   ```

2. **Create Dockerfile** in project root:

   ```dockerfile
   FROM node:20-alpine

   WORKDIR /app
   COPY package*.json ./
   RUN npm install --production

   COPY . .

   # Run cron schedule + keep alive
   CMD ["sh", "-c", "node main.js"]
   ```

3. **Deploy to server:**

   ```bash
   # Build locally
   docker build -t ehdb-scraper .

   # Transfer to server (or use registry)
   scp docker-compose.yml user@your-server:~

   # Run on server
   ssh user@your-server "docker run -d --name ehdb-scraper ehdb-scraper"
   ```

4. **Schedule** - Use cron inside container or external scheduler

---

## Migration Path

1. **Local Development** - Build and test on your machine (Phase 1-8)
2. **Install Docker** on home server (once)
3. **Deploy** - Transfer container to server
4. **Schedule** - Run on schedule via cron

---

## Next Steps

1. Create new project: `mkdir -p /Users/blooverh/Desktop/ehdb-scraper`
2. Copy `models/cpu.js` and `models/server.js` from existing scraper
3. Create `config/settings.js`
4. Create `core/BaseScraper.js`, `BrowserManager.js`, `RetryManager.js`
5. Update `package.json` with new dependencies
6. Create directories: `core/`, `services/`, `scrapers/priceUpdater/`, `scrapers/discovery/`, `scheduler/`, `logs/discovery/`
7. Build Phase 1 → Test → Move to Phase 2

---

## Phase 1: Foundation Checklist

- [ ] Create project directory
- [ ] Copy models from existing scraper
- [ ] Create `config/settings.js`
- [ ] Create `core/BaseScraper.js`
- [ ] Create `core/BrowserManager.js`
- [ ] Create `core/RetryManager.js`
- [ ] Update `package.json`
- [ ] Test basic import

---

_Document Version: 1.6_
_Last Updated: March 2, 2026_

```

```
