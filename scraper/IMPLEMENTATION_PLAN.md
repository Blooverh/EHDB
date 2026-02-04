# EHDB AI-Enhanced Web Scraper Implementation Plan

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Workflow](#workflow)
4. [Key Components](#key-components)
5. [Configuration](#configuration)
6. [Database Schema Updates](#database-schema-updates)
7. [Implementation Phases](#implementation-phases)
8. [Dependencies](#dependencies)
9. [Usage](#usage)
10. [Hosting](#hosting)
11. [Notes](#notes)

---

## Overview

This document outlines the comprehensive plan to transform the existing EHDB web scraper into an AI-enhanced, maintainable, and robust system.

### Core Philosophy

- **Two-Tier Scraping Approach:**
  - **Discovery Phase** (One-time): Deep AI-powered scraping of product specifications
  - **Price Update Phase** (Recurring): Lightweight scraping of prices only

- **Smart Automation:**
  - Auto-discovery triggered when new products are detected
  - AI-powered product matching across vendors
  - Intelligent scheduling with high-traffic skip

### Key Requirements

| Requirement       | Implementation                                             |
| ----------------- | ---------------------------------------------------------- |
| Cron Schedule     | Every Saturday at 2 AM                                     |
| AI Matching       | Built-in, configurable (disabled via `config/settings.js`) |
| Hosting           | Standalone Node.js process connecting to shared MongoDB    |
| Notifications     | Console logs only (configurable levels)                    |
| High-Traffic Skip | Enabled - skips if server load > 50%                       |
| Data Retention    | Keep previous price before each update                     |

---

## Architecture

```
scraper/
├── core/                                    # Base framework
│   ├── BaseScraper.js                       # Common Puppeteer setup
│   ├── BrowserManager.js                    # Browser lifecycle + cleanup
│   └── RetryManager.js                      # Exponential backoff
├── services/                                # Business logic
│   ├── ProductMatcher.js                    # Brand/Model + AI matching
│   ├── AIExtractor.js                       # AI specs extraction (disable-able)
│   ├── PriceHistory.js                      # Tracks previous prices
│   ├── NotificationService.js               # Console logging
│   └── DiscoveryLogger.js                   # JSON logs for debugging
├── scrapers/
│   ├── priceUpdater/                        # Lightweight - runs every Saturday
│   │   ├── CloudNinjasPriceUpdater.js
│   │   ├── XBytePriceUpdater.js
│   │   └── ServerMonkeyPriceUpdater.js
│   └── discovery/                           # AI-enhanced - auto-triggered
│       ├── CloudNinjasDiscovery.js
│       ├── XByteDiscovery.js
│       └── ServerMonkeyDiscovery.js
├── scheduler/
│   └── cron-jobs.js                         # Saturday 2AM + skip high-traffic
├── models/
│   ├── cpu.js                               # Add metadata fields
│   └── server.js                            # Add metadata fields
├── config/
│   └── settings.js                          # All configuration (AI on/off here)
├── tests/                                   # Test files
└── main.js                                  # Entry point (standalone process)
```

---

## Workflow

```
┌────────────────────────────────────────────────────────────────────┐
│                    SCHEDULER (Every Saturday 2AM)                  │
│                  (Skips if high-traffic day detected)              │
└────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────────┐
│  1. PRICE UPDATE PHASE                                             │
│     ├─ Scrape listing pages (lightweight)                          │
│     ├─ Match products by: brand + normalized model (primary)       │
│     ├─ AI fallback for uncertain matches                           │
│     └─ For each product:                                           │
│         ├─ Existing: Save old price → Update new price             │
│         └─ New: Queue for DISCOVERY PHASE                          │
└────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────────┐
│  2. AUTO DISCOVERY PHASE (for queued new products)                 │
│     ├─ Visit detail pages                                          │
│     ├─ AI extract full specifications                              │
│     ├─ AI cross-reference existing products                        │
│     └─ Create new product in DB                                    │
└────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────────┐
│  3. NOTIFICATION PHASE                                             │
│     ├─ Log new products discovered                                 │
│     ├─ Log significant price changes                               │
│     └─ Log any errors/issues                                       │
└────────────────────────────────────────────────────────────────────┘
```

---

## Key Components

### 1. ProductMatcher.js

**Purpose:** Match products across vendors using brand + model + AI.

**Matching Strategy:**

```
Step 1: Exact Match (brand + normalized model)
        ↓ (no match)
Step 2: AI Semantic Matching (if enabled)
        ↓ (no match)
Step 3: Fuzzy Matching (fallback)
        ↓ (no match)
Step 4: Truly New Product → Queue for Discovery
```

**Normalization Function:**

```javascript
normalize(model) {
  return model.toLowerCase()
    .replace(/processor|cpu|server|system/gi, '')
    .replace(/[^a-z0-9]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
```

**Example:**

- `"AMD EPYC 7763 64-Core 2.45GHz Processor"` → `"amd epyc7763 64c 245ghz"`
- `"AMD EPYC 7763 2.45GHz Sixty-Four Core"` → `"amd epyc7763 64c 245ghz"`
- **Match found!**

---

### 2. AIExtractor.js

**Purpose:** Extract structured specifications from product detail pages using free LLM models.

**Features:**

- Master switch in `config/settings.js.ai.enabled`
- Individual control for matching vs extraction
- Uses free LLM providers (OpenCode, Ollama, or Hugging Face)
- Returns confidence score for each extraction
- Falls back to rule-based extraction if AI is disabled

**Supported Providers:**

```javascript
// config/settings.js
ai: {
  provider: 'opencode',  // Primary: opencode.ai (free)
  // provider: 'ollama',   // Alternative: local Ollama
  // provider: 'huggingface', // Alternative: Hugging Face Inference
  model: 'opencode/minimax-m2.1-free',
  baseUrl: 'https://api.opencode.ai/v1',
  apiKey: process.env.LLM_API_KEY  // Optional for some providers
}
```

**Usage (disable-able):**

```javascript
// To disable AI:
config.ai.enabled = false; // All AI off
// OR
config.ai.matching = false; // Only matching off
// OR
config.ai.extraction = false; // Only extraction off
```

---

### 3. PriceHistory.js (Uses Existing Schema)

**Purpose:** Track previous prices before each update using existing `info` array.

**Data Retention:**

- Uses existing `info` array in CPU/Server models
- Stores: `currPrice`, `oldPrice`, and `priceChange` for each vendor
- Each update: `current price → becomes previous price`
- No additional schema required

**Existing Schema (already in models):**

```javascript
info: [
  {
    website: String, // Vendor name
    currPrice: Number, // Current price
    oldPrice: Number, // Previous price
    priceChange: Number, // Percentage change (auto-calculated)
    link: String, // Product URL
  },
];
```

**Service Logic:**

```javascript
async updatePrice(product, vendor, newPrice) {
  const vendorInfo = product.info.find(i => i.website === vendor);

  if (vendorInfo) {
    // Move current to old
    vendorInfo.oldPrice = vendorInfo.currPrice;
    // Update current
    vendorInfo.currPrice = newPrice;
    // Calculate percentage change
    vendorInfo.priceChange = this.calculateChange(
      vendorInfo.oldPrice,
      vendorInfo.currPrice
    );
  }

  product.metadata.lastPriceUpdate = new Date();
  await product.save();
}
```

---

### 4. Scheduler (cron-jobs.js)

**Schedule:**

```javascript
// Every Saturday at 2:00 AM
"0 2 * * 6";
```

**High-Traffic Skip:**

```javascript
{
  skipHighTraffic: true,
  highTrafficThreshold: 50  // Skip if server load > 50%
}
```

---

### 5. DiscoveryLogger.js

**Purpose:** Log all discovered products to JSON files for debugging and auditing.

**Features:**

- Creates one JSON file per scrape date
- Logs timestamp, vendor, product details, and match status
- Non-critical (doesn't affect main scraper flow)
- Minimal async file I/O overhead

**Log Format:**

```javascript
// logs/discovery_2026-02-03.json
{
  "scrapeDate": "2026-02-03T02:00:00Z",
  "summary": {
    "totalDiscovered": 12,
    "totalNew": 8,
    "totalMatched": 4
  },
  "products": [
    {
      "timestamp": "2026-02-03T02:15:23Z",
      "vendor": "cloudninjas",
      "category": "cpu",
      "brand": "AMD",
      "model": "EPYC 7763",
      "price": 1299.99,
      "isNewProduct": true,
      "aiConfidence": 0.95,
      "sourceUrl": "https://..."
    }
  ]
}
```

**Configuration:**

```javascript
// config/settings.js
logging: {
  discovery: {
    enabled: true,
    directory: 'logs/discovery',
    retentionDays: 90,  // Keep logs for 90 days
    filenameFormat: 'discovery_YYYY-MM-DD.json'
  }
}
```

**Usage:**

```javascript
// Called after each product discovery
await discoveryLogger.log({
  vendor: "cloudninjas",
  brand: "AMD",
  model: "EPYC 7763",
  isNewProduct: true,
  aiConfidence: 0.95,
});
```

**Note:** These logs are for debugging only. Discovered products are always saved to the database regardless of logging status.

---

## Configuration

### config/settings.js

```javascript
export default {
  // Scheduling
  schedule: {
    priceUpdate: "0 2 * * 6", // Every Saturday at 2 AM
    skipHighTraffic: true, // Skip if server load > 50%
    highTrafficThreshold: 50, // CPU threshold percentage
  },

  // AI Features - Uses FREE LLM models (OpenCode, Ollama, HuggingFace)
  ai: {
    enabled: true, // Master switch
    matching: true, // AI product matching
    extraction: true, // AI specs extraction
    provider: "opencode", // 'opencode' | 'ollama' | 'huggingface'
    model: "opencode/minimax-m2.1-free", // Free model
    baseUrl: process.env.LLM_BASE_URL || "https://api.opencode.ai/v1",
    apiKey: process.env.LLM_API_KEY, // Optional for some providers
    temperature: 0.1, // Low for consistent extraction
  },

  // Scraping behavior
  scraping: {
    headless: true,
    timeout: 60000, // 60 seconds
    minDelay: 2000, // 2 seconds between requests
    maxDelay: 5000, // 5 seconds
    retryAttempts: 3,
  },

  // Logging
  logging: {
    level: "info", // 'debug' | 'info' | 'warn' | 'error'
    notifyOnNewProduct: true,
    notifyOnPriceChange: true,
    notifyOnErrors: true,
    // Discovery logging (for debugging)
    discovery: {
      enabled: true,
      directory: "logs/discovery",
      retentionDays: 90, // Keep logs for 90 days
    },
  },

  // Database (shared instance)
  database: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/ehdb",
  },
};
```

---

## Database Schema Updates

### models/cpu.js & models/server.js

Add to existing schema (no new model needed):

```javascript
{
  // ... existing fields (info array already exists with currPrice, oldPrice, priceChange) ...

  metadata: {
    discoveryDate: Date,              // When first discovered
    lastPriceUpdate: Date,            // Last price update
    discoverySource: String,          // Which vendor first discovered it
    needsReDiscovery: {
      type: Boolean,
      default: false
    }
  }
}
```

**Note:** Price history is already embedded in the existing `info` array which contains:

- `currPrice` - Current price from vendor
- `oldPrice` - Previous price (updated automatically)
- `priceChange` - Percentage change (auto-calculated)

No new schema required!

---

## Implementation Phases

### Phase 1: Foundation (Week 1)

| Task                   | Files                                           | Effort  |
| ---------------------- | ----------------------------------------------- | ------- |
| Config & Settings      | `config/settings.js`                            | 2 hours |
| Base Scraper Framework | `core/BaseScraper.js`, `core/BrowserManager.js` | 4 hours |
| Retry Manager          | `core/RetryManager.js`                          | 2 hours |

### Phase 2: Core Services (Week 1-2)

| Task                    | Files                             | Effort  |
| ----------------------- | --------------------------------- | ------- |
| Notification Service    | `services/NotificationService.js` | 1 hour  |
| Price History Service   | `services/PriceHistory.js`        | 1 hour  |
| Product Matcher (Basic) | `services/ProductMatcher.js`      | 4 hours |
| Discovery Logger        | `services/DiscoveryLogger.js`     | 1 hour  |

### Phase 3: AI Integration (Week 2)

| Task                    | Files                                 | Effort  |
| ----------------------- | ------------------------------------- | ------- |
| AI Extractor            | `services/AIExtractor.js`             | 4 hours |
| AI Matching Integration | `services/ProductMatcher.js` (update) | 2 hours |

### Phase 4: Price Updaters (Week 2-3)

| Task                  | Files                                               | Effort  |
| --------------------- | --------------------------------------------------- | ------- |
| Cloud Ninjas Updater  | `scrapers/priceUpdater/CloudNinjasPriceUpdater.js`  | 4 hours |
| XByte Updater         | `scrapers/priceUpdater/XBytePriceUpdater.js`        | 4 hours |
| Server Monkey Updater | `scrapers/priceUpdater/ServerMonkeyPriceUpdater.js` | 4 hours |

### Phase 5: Discovery Scrapers (Week 3)

| Task                    | Files                                         | Effort  |
| ----------------------- | --------------------------------------------- | ------- |
| Cloud Ninjas Discovery  | `scrapers/discovery/CloudNinjasDiscovery.js`  | 4 hours |
| XByte Discovery         | `scrapers/discovery/XByteDiscovery.js`        | 4 hours |
| Server Monkey Discovery | `scrapers/discovery/ServerMonkeyDiscovery.js` | 4 hours |

### Phase 6: Scheduler (Week 3)

| Task           | Files                        | Effort  |
| -------------- | ---------------------------- | ------- |
| Cron Jobs      | `scheduler/cron-jobs.js`     | 2 hours |
| System Monitor | `scheduler/SystemMonitor.js` | 1 hour  |

### Phase 7: Main Entry & Integration (Week 4)

| Task                 | Files          | Effort  |
| -------------------- | -------------- | ------- |
| Main Entry Point     | `main.js`      | 2 hours |
| Package.json Updates | `package.json` | 30 min  |
| Environment Setup    | `.env.example` | 15 min  |

### Phase 8: Database Updates (Week 4)

| Task             | Files                               | Effort  |
| ---------------- | ----------------------------------- | ------- |
| Schema Updates   | `models/cpu.js`, `models/server.js` | 1 hour  |
| Migration Script | `scripts/migrate-existing-data.js`  | 2 hours |

### Phase 9: Testing (Week 4)

| Task              | Files                         | Effort  |
| ----------------- | ----------------------------- | ------- |
| Unit Tests        | `tests/unit/*.test.js`        | 4 hours |
| Integration Tests | `tests/integration/*.test.js` | 4 hours |

---

## Dependencies

### New Dependencies

```json
{
  "dependencies": {
    "node-cron": "^3.0.3",
    "fuse.js": "^7.0.0",
    "@langchain/core": "^0.2.0"
  }
}
```

**Note:** OpenCode and Ollama don't require dedicated SDK packages - they use standard HTTP requests. This keeps dependencies minimal and free.

### Existing Dependencies

```json
{
  "dependencies": {
    "commander": "^14.0.0",
    "dotenv": "^17.0.0",
    "mongoose": "^8.16.1",
    "puppeteer": "^24.11.1",
    "puppeteer-extra": "^3.3.6",
    "puppeteer-extra-plugin-stealth": "^2.11.2",
    "slugify": "^1.6.6"
  }
}
```

---

## Usage

### Development

```bash
# Run with hot reload
npm run dev

# Or directly
node --watch main.js
```

### Production

```bash
# Build (if needed)
npm run build

# Start with PM2 for process management
pm2 start main.js --name ehdb-scraper

# Check logs
pm2 logs ehdb-scraper

# Monitor
pm2 monit ehdb-scraper

# Restart
pm2 restart ehdb-scraper

# Stop
pm2 stop ehdb-scraper
```

### Manual Commands

```bash
# Run price update immediately
npm run price:update

# Run discovery scan
npm run discovery:run

# Run full pipeline (discovery + price update)
npm run full:pipeline

# Check status
npm run status
```

### Configuration

```bash
# Set MongoDB URI (shared instance)
export MONGODB_URI="mongodb://user:pass@host:27017/ehdb"

# Set LLM Provider (optional - uses free OpenCode by default)
export LLM_API_KEY=""  # Optional for OpenCode
export LLM_BASE_URL="https://api.opencode.ai/v1"  # Default

# Run with custom config
CONFIG_PATH=/path/to/config.js node main.js
```

---

## Hosting (Direct Node.js Execution)

The scraper runs as a **direct Node.js process** with built-in cron scheduling. No Docker containerization needed.

### How Cron Jobs Work (Direct Approach)

The `node-cron` library runs **inside** the Node.js process:

```javascript
// scheduler/cron-jobs.js
const cron = require("node-cron");

// This runs continuously in the background
const job = cron.schedule("0 2 * * 6", async () => {
  console.log("Saturday 2AM - Running scraper...");
  await runScraper();
});
```

**Process Flow:**

1. You start the scraper once: `node main.js`
2. Process stays alive in background
3. `node-cron` triggers automatically every Saturday at 2AM
4. Logs output to console/log file

### Deployment Options

#### Option A: systemd Service (Linux - Recommended)

**1. Create service file:**

```bash
sudo nano /etc/systemd/system/ehdb-scraper.service
```

```ini
[Unit]
Description=EHDB Web Scraper
After=network.target

[Service]
Type=simple
User=node
WorkingDirectory=/path/to/scraper
ExecStart=/usr/bin/node main.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
EnvironmentFile=/path/to/scraper/.env

[Install]
WantedBy=multi-user.target
```

**2. Enable and start:**

```bash
sudo systemctl daemon-reload
sudo systemctl enable ehdb-scraper
sudo systemctl start ehdb-scraper
sudo systemctl status ehdb-scraper
```

**3. View logs:**

```bash
# Real-time logs
journalctl -u ehdb-scraper -f

# Last 100 lines
journalctl -u ehdb-scraper -n 100
```

#### Option B: PM2 (Cross-Platform)

```bash
# Install PM2 globally
npm install -g pm2

# Start scraper
pm2 start main.js --name ehdb-scraper

# Save PM2 config
pm2 save
pm2 startup

# Monitor
pm2 logs ehdb-scraper
pm2 monit

# Restart/Stop
pm2 restart ehdb-scraper
pm2 stop ehdb-scraper
```

#### Option C: Background Process (Simple)

```bash
# Run in background with nohup
nohup node main.js > scraper.log 2>&1 &

# Check if running
ps aux | grep main.js

# View logs
tail -f scraper.log

# Stop
kill <PID>
```

### Why Direct Execution?

✅ **Simpler** - No Docker complexity
✅ **Lower overhead** - No container runtime
✅ **Easier debugging** - Direct access to logs/process
✅ **Resource efficient** - Less memory/CPU usage
✅ **Same scheduling** - `node-cron` works identically

---

## Notes

### Existing Data Migration

Your existing data works as-is. When ready to migrate:

```javascript
// scripts/migrate-existing-data.js
async function migrateExistingData() {
  const cpus = await CPU.find();

  for (const cpu of cpus) {
    // Add metadata fields to existing documents
    if (!cpu.metadata) {
      cpu.metadata = {
        discoveryDate: cpu.createdAt || new Date(),
        lastPriceUpdate: cpu.updatedAt,
        discoverySource: "migration",
        needsReDiscovery: false,
      };
      await cpu.save();
    }
  }

  console.log(`Migrated ${cpus.length} CPU records`);
}
```

**To run migration:**

```bash
node scripts/migrate-existing-data.js
```

### Web Host Integration (Future Enhancement)

If you want the scraper to run within your web host later:

```javascript
// In your existing backend/server.js
import { ScraperScheduler } from "../scraper/scheduler/cron-jobs.js";

// Start alongside your Express server
const scheduler = new ScraperScheduler(services);
scheduler.start();
```

### Cost Estimation (FREE LLM Models)

| Task                  | Frequency       | AI Usage | Est. Monthly Cost      |
| --------------------- | --------------- | -------- | ---------------------- |
| **Discovery**         | Per new product | High     | **$0** (OpenCode free) |
| **Price Updates**     | Weekly          | None     | $0                     |
| **Anomaly Detection** | Real-time       | Low      | **$0** (Ollama local)  |
| **Total**             | -               | -        | **$0/month**           |

_Note: Using free LLM providers (OpenCode, Ollama, or HuggingFace) eliminates API costs. Optional: self-hosted Ollama for complete offline capability._

### Environment Variables

```bash
# .env (create this file in scraper/ directory)
MONGODB_URI=mongodb://localhost:27017/ehdb
LLM_API_KEY=  # Optional for OpenCode (leave empty for free tier)
LLM_BASE_URL=https://api.opencode.ai/v1  # Default free endpoint
NODE_ENV=development
LOG_LEVEL=info
```

### Troubleshooting

| Issue                     | Solution                                    |
| ------------------------- | ------------------------------------------- |
| Puppeteer fails to launch | Ensure Chrome/Chromium is installed         |
| MongoDB connection fails  | Verify URI in `.env` file                   |
| AI features not working   | Check LLM settings in config                |
| Scheduler not running     | Verify `node-cron` is installed             |
| High memory usage         | Check for browser leaks in `BrowserManager` |

---

## Summary

| Aspect                | Implementation                                                   |
| --------------------- | ---------------------------------------------------------------- |
| **Schedule**          | Every Saturday at 2 AM                                           |
| **AI Matching**       | Built-in, disable via `config/settings.js.ai.matching = false`   |
| **AI Extraction**     | Built-in, disable via `config/settings.js.ai.extraction = false` |
| **LLM Provider**      | Free models (OpenCode, Ollama, HuggingFace)                      |
| **Hosting**           | Standalone Node.js process                                       |
| **Database**          | Shared MongoDB instance                                          |
| **Notifications**     | Console logs                                                     |
| **Discovery Logging** | JSON files in `logs/discovery/` (for debugging)                  |
| **High-Traffic Skip** | Enabled (skip if server load > 50%)                              |
| **Data Retention**    | Uses existing `info` array (currPrice, oldPrice, priceChange)    |

---

## Next Steps

1. **Review this plan** and confirm requirements
2. **Create initial files:**
   - `config/settings.js`
   - `core/BaseScraper.js`
   - `services/NotificationService.js`
3. **Set up environment:**
   - Create `.env` file
   - Install new dependencies
4. **Begin Phase 1 implementation**
5. **Create logs directory:**
   - `mkdir logs/discovery`

---

_Document Version: 1.3_
_Created: February 2026_
_Last Updated: February 3, 2026_

**Version 1.3 Updates:**

- Added DiscoveryLogger service for JSON file-based discovery logging
- Logs stored in `logs/discovery/discovery_YYYY-MM-DD.json`
- Non-critical debugging feature (products always saved to DB)

**Version 1.2 Updates:**

- Changed hosting from Docker to direct Node.js execution
- Added detailed systemd/PM2/background process setup instructions
- Removed Docker containerization (can be added later if needed)

**Version 1.1 Updates:**

- Changed LLM provider from OpenAI to free models (OpenCode/Ollama)
- Removed new PriceHistory.js schema - uses existing `info` array instead
- Updated dependencies to remove OpenAI SDK
- Updated cost estimation to $0/month (free LLM models)
