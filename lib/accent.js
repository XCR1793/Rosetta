const { execFileSync } = require('child_process');
const { systemPreferences } = require('electron');

const FALLBACK_ACCENT = '#0078d4';

function normalizeAccentColor(raw) {
  if (typeof raw !== 'string') return FALLBACK_ACCENT;
  const hex = raw.replace('#', '').trim();
  if (/^[0-9a-fA-F]{6}$/.test(hex)) return `#${hex.toLowerCase()}`;
  if (/^[0-9a-fA-F]{8}$/.test(hex)) return `#${hex.slice(0, 6).toLowerCase()}`;
  return FALLBACK_ACCENT;
}

function dwordToHexAbgr(value) {
  const n = Number(value) >>> 0;
  const r = n & 0xff;
  const g = (n >>> 8) & 0xff;
  const b = (n >>> 16) & 0xff;
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

function readWindowsAccentFromRegistry() {
  const ps = [
    "$d = Get-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\DWM' -ErrorAction Stop",
    "if ($null -ne $d.AccentColor) { Write-Output ('Accent=' + [uint32]$d.AccentColor); exit 0 }",
    "if ($null -ne $d.ColorizationColor) { Write-Output ('Colorization=' + [uint32]$d.ColorizationColor); exit 0 }",
    'exit 1'
  ].join('; ');

  const stdout = execFileSync(
    'powershell.exe',
    ['-NoProfile', '-NonInteractive', '-Command', ps],
    { encoding: 'utf8', windowsHide: true, timeout: 4000 }
  ).trim();

  if (stdout.startsWith('Accent=')) {
    return dwordToHexAbgr(stdout.slice('Accent='.length));
  }

  if (stdout.startsWith('Colorization=')) {
    // ColorizationColor is AARRGGBB
    const n = Number(stdout.slice('Colorization='.length)) >>> 0;
    const r = (n >>> 16) & 0xff;
    const g = (n >>> 8) & 0xff;
    const b = n & 0xff;
    return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
  }

  throw new Error('No accent colour found in registry');
}

function readElectronAccent() {
  const raw = systemPreferences.getAccentColor();
  return normalizeAccentColor(raw);
}

/**
 * Prefer the Windows DWM AccentColor registry value.
 * Electron's getAccentColor() has historically returned shifted/wrong hues on Windows.
 */
function getSystemAccentColor() {
  if (process.platform === 'win32') {
    try {
      return normalizeAccentColor(readWindowsAccentFromRegistry());
    } catch (e) {
      console.error('Registry accent read failed, falling back to Electron:', e.message);
    }
  }

  try {
    return readElectronAccent();
  } catch (e) {
    console.error('Error reading system accent color:', e);
    return FALLBACK_ACCENT;
  }
}

module.exports = {
  FALLBACK_ACCENT,
  normalizeAccentColor,
  getSystemAccentColor
};
