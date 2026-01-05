# Rosetta

A modern, highly customizable world time and schedule visualizer for desktop. Built with Electron, Rosetta lets you compare, sync, and theme multiple timezones with advanced timeline and converter features.

## Features

- **Multi-TimeZone Timelines:**
  - Add unlimited timezones, each with custom name, work, sleep, and awake hours
  - 48-hour timeline bar for each entry (shows two days for context)
  - Visual schedule blocks: work, awake, sleep
  - Current time indicator for each timezone
  - Sync mode: align all timelines to the current time of the first entry
  - Unsynced mode: all timelines show 12am–12am
  - Timeline auto-updates every second

- **Theme System:**
  - 5 built-in presets: Default (black/white/orange), Night, Day, Volcano, Astral
  - 3 custom theme slots (save your own color schemes)
  - Live theme editor: adjust 30+ color variables with instant preview
  - Save/unsaved detection with custom confirmation popup (no libraries)
  - All UI colors, accents, and timeline visuals are themeable

- **Unit Converter:**
  - Built-in panel for temperature, currency, length, and weight
  - Currency rates auto-fetched and display last update time
  - Swap units, compact layout, and keyboard-friendly

- **Other Features:**
  - Frameless, draggable window
  - Compact mode toggle
  - 12h/24h time toggle
  - Settings panel for preferences
  - Custom confirmation popups (no external libraries)

## How to Use

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Run the app:**
   ```sh
   npm start
   ```

## Usage Guide

- **Add/Edit Timelines:**
  - Use the UI to add new timezones, set names, and adjust work/sleep/awake hours
  - Drag to reorder timelines
- **Sync Mode:**
  - Click the sync button to align all timelines to the current time of the first entry
  - Click again to unsync (all timelines show 12am–12am)
- **Theme Editor:**
  - Click the palette button to open the theme editor
  - Choose a preset or edit colors live
  - Save to store your custom theme
- **Converter:**
  - Open the converter panel to convert between temperature, currency, length, and weight
  - Currency rates update automatically

## Project Structure

- `index.html` — Main UI
- `renderer.js` — All frontend logic (timelines, theming, converter, etc.)
- `styles.css` — Unified CSS variable system and all styles
- `main.js`, `preload.js`, `launch.js` — Electron app entrypoints
- `package.json` — Project config

## How to Run (Development)

1. **Install Node.js** (v18+ recommended)
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the app:**
   ```sh
   npm start
   ```

## Title & Description

**Rosetta** — World Time Visualizer & Themeable Timeline App

A powerful, themeable desktop app for comparing, syncing, and visualizing world time schedules. Perfect for remote teams, travelers, and anyone working across timezones.

---

For advanced configuration or troubleshooting, see the comments in `renderer.js` and `styles.css`.
