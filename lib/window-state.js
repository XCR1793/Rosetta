const fs = require('fs');
const path = require('path');
const { screen } = require('electron');

const DEFAULT_BOUNDS = {
  width: 520,
  height: 360
};

function getConfigPath(userDataPath) {
  return path.join(userDataPath, 'window-state.json');
}

function loadWindowState(userDataPath) {
  try {
    const filePath = getConfigPath(userDataPath);
    if (!fs.existsSync(filePath)) return { ...DEFAULT_BOUNDS };
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return {
      width: Number(parsed.width) || DEFAULT_BOUNDS.width,
      height: Number(parsed.height) || DEFAULT_BOUNDS.height,
      x: Number.isFinite(Number(parsed.x)) ? Number(parsed.x) : undefined,
      y: Number.isFinite(Number(parsed.y)) ? Number(parsed.y) : undefined,
      isMaximized: Boolean(parsed.isMaximized)
    };
  } catch (e) {
    console.error('Error loading window state:', e);
    return { ...DEFAULT_BOUNDS };
  }
}

function saveWindowState(userDataPath, state) {
  try {
    const filePath = getConfigPath(userDataPath);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(state, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving window state:', e);
  }
}

function rectsIntersect(a, b) {
  return !(
    a.x + a.width <= b.x ||
    b.x + b.width <= a.x ||
    a.y + a.height <= b.y ||
    b.y + b.height <= a.y
  );
}

function intersectionArea(a, b) {
  const x1 = Math.max(a.x, b.x);
  const y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.width, b.x + b.width);
  const y2 = Math.min(a.y + a.height, b.y + b.height);
  const w = x2 - x1;
  const h = y2 - y1;
  if (w <= 0 || h <= 0) return 0;
  return w * h;
}

/**
 * True when a visible chunk of the window still sits on some connected display.
 * Tiny residual overlaps from dead monitors shouldn't count.
 */
function isBoundsOnAnyDisplay(bounds) {
  if (
    !bounds ||
    !Number.isFinite(bounds.x) ||
    !Number.isFinite(bounds.y) ||
    !Number.isFinite(bounds.width) ||
    !Number.isFinite(bounds.height)
  ) {
    return false;
  }

  const area = Math.max(1, bounds.width * bounds.height);
  const minVisible = Math.min(area * 0.25, 120 * 80);

  return screen.getAllDisplays().some((display) => {
    const workArea = display.workArea;
    if (!rectsIntersect(bounds, workArea)) return false;
    return intersectionArea(bounds, workArea) >= minVisible;
  });
}

function centerOnPrimaryDisplay(width, height) {
  const { workArea } = screen.getPrimaryDisplay();
  const w = Math.min(Math.max(280, width || DEFAULT_BOUNDS.width), workArea.width);
  const h = Math.min(Math.max(200, height || DEFAULT_BOUNDS.height), workArea.height);

  return {
    width: w,
    height: h,
    x: Math.round(workArea.x + (workArea.width - w) / 2),
    y: Math.round(workArea.y + (workArea.height - h) / 2),
    isMaximized: false
  };
}

function resolveWindowState(userDataPath) {
  const saved = loadWindowState(userDataPath);
  const width = Math.max(280, saved.width || DEFAULT_BOUNDS.width);
  const height = Math.max(200, saved.height || DEFAULT_BOUNDS.height);

  const candidate = {
    width,
    height,
    x: saved.x,
    y: saved.y,
    isMaximized: Boolean(saved.isMaximized)
  };

  if (
    !Number.isFinite(candidate.x) ||
    !Number.isFinite(candidate.y) ||
    !isBoundsOnAnyDisplay(candidate)
  ) {
    return centerOnPrimaryDisplay(width, height);
  }

  return candidate;
}

function trackWindowState(win, userDataPath) {
  let saveTimer = null;

  const persist = () => {
    if (!win || win.isDestroyed() || win.isMinimized()) return;

    const normal = win.getNormalBounds();
    const core = typeof win.getPerchPersistBounds === 'function'
      ? win.getPerchPersistBounds(normal)
      : normal;

    saveWindowState(userDataPath, {
      width: core.width,
      height: core.height,
      x: core.x,
      y: core.y,
      isMaximized: win.isMaximized()
    });
  };

  const schedulePersist = () => {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(persist, 200);
  };

  win.on('moved', schedulePersist);
  win.on('resized', schedulePersist);
  win.on('maximize', schedulePersist);
  win.on('unmaximize', schedulePersist);
  win.on('close', persist);
}

module.exports = {
  DEFAULT_BOUNDS,
  resolveWindowState,
  trackWindowState,
  centerOnPrimaryDisplay,
  isBoundsOnAnyDisplay
};
