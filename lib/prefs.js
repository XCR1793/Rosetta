const fs = require('fs');
const path = require('path');

function getPrefsPath(userDataPath) {
  return path.join(userDataPath, 'prefs.json');
}

function loadPrefs(userDataPath) {
  try {
    const filePath = getPrefsPath(userDataPath);
    if (!fs.existsSync(filePath)) return {};
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (e) {
    console.error('Error loading prefs:', e);
    return {};
  }
}

function savePrefs(userDataPath, patch = {}) {
  try {
    const current = loadPrefs(userDataPath);
    const next = { ...current, ...patch };
    const filePath = getPrefsPath(userDataPath);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(next, null, 2), 'utf8');
    return next;
  } catch (e) {
    console.error('Error saving prefs:', e);
    return loadPrefs(userDataPath);
  }
}

module.exports = {
  loadPrefs,
  savePrefs
};
