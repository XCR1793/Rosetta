# World Time Translator - Source Code Structure

This document describes the modular source code structure following the architecture guidelines in `ARCHITECTURE.md`.

## Directory Structure

```
src/
├── main/                       # Main (Node.js) process
│   ├── controllers/            # IPC request handlers
│   │   ├── AppController.js    # App lifecycle & config IPC
│   │   └── index.js
│   ├── services/               # Business logic services
│   │   ├── ConfigManager.js    # Configuration persistence
│   │   ├── WindowManager.js    # BrowserWindow management
│   │   └── index.js
│   └── main.js                 # Entry point
│
├── preload/                    # Preload scripts (context bridge)
│   └── preload.js              # Exposes electronAPI to renderer
│
├── renderer/                   # Renderer (Browser) process
│   ├── components/             # UI components
│   │   ├── features/           # Feature-specific components
│   │   │   ├── Timeline.js     # Timeline visualization
│   │   │   ├── Converter.js    # Unit converter panel
│   │   │   ├── Settings.js     # Settings panel
│   │   │   └── index.js
│   │   └── index.js
│   ├── services/               # Frontend services
│   │   ├── CurrencyService.js  # Currency API integration
│   │   └── index.js
│   ├── store/                  # State management
│   │   ├── Store.js            # Application state store
│   │   └── index.js
│   └── renderer.js             # Entry point
│
└── shared/                     # Shared between processes
    ├── constants/              # Application constants
    │   └── index.js            # Timezones, units, defaults
    ├── utils/                  # Utility functions
    │   ├── timezone.js         # Timezone calculations
    │   ├── conversion.js       # Unit conversions
    │   └── index.js
    └── index.js
```

## Module Descriptions

### Main Process (`src/main/`)

#### Services

- **ConfigManager**: Handles loading/saving configuration to disk
- **WindowManager**: Creates and manages BrowserWindow instances

#### Controllers

- **AppController**: Handles IPC requests from renderer process
  - `get-config`: Returns current configuration
  - `save-config`: Persists configuration to disk
  - `close-app`: Quits the application

### Preload (`src/preload/`)

- **preload.js**: Uses contextBridge to expose a secure API to the renderer

### Renderer Process (`src/renderer/`)

#### Components

- **TimelineComponent**: Renders timeline rows with schedule blocks and time indicators
- **ConverterComponent**: Unit converter panel (temp, currency, length, weight)
- **SettingsComponent**: Timeline configuration panel

#### Services

- **CurrencyService**: Fetches and caches currency exchange rates

#### Store

- **Store**: Simple reactive state management

### Shared (`src/shared/`)

#### Constants

- `TIMEZONES`: Comprehensive timezone list with IANA names
- `CONVERSION_UNITS`: Unit conversion data
- `DEFAULT_CONFIG`: Default application configuration

#### Utils

- **timezone.js**: `getCurrentOffset`, `formatOffset`, `getTimeInTimezone`, etc.
- **conversion.js**: `convertTemperature`, `convertLength`, `convertWeight`, etc.

## Running

The application can be run in two ways:

1. **Legacy mode** (using root files):
   ```bash
   npm start
   ```

2. **Modular mode** (using src/ structure):
   ```bash
   npm run start:src
   ```

## Notes

- The root-level `main.js`, `preload.js`, and `renderer.js` files are kept for backward compatibility
- The new modular structure in `src/` follows the ARCHITECTURE.md guidelines
- ES modules are used in the renderer process and shared code
- CommonJS modules are used in the main process for Electron compatibility
