const { app, shell } = require('electron');
const { autoUpdater } = require('electron-updater');

const RELEASES_URL = 'https://github.com/CawLabs/Perch/releases';
const LATEST_API = 'https://api.github.com/repos/CawLabs/Perch/releases/latest';

/** @type {'idle'|'checking'|'available'|'downloading'|'ready'|'error'|'not-available'} */
let status = 'idle';
let latestVersion = null;
let errorMessage = null;
let downloadProgress = null;
let githubSaysUpdate = false;
/** @type {((payload: object) => void)|null} */
let emit = null;

function currentVersion() {
  return app.getVersion();
}

function snapshot() {
  return {
    status,
    currentVersion: currentVersion(),
    latestVersion,
    errorMessage,
    downloadProgress,
    packaged: app.isPackaged,
    releasesUrl: RELEASES_URL
  };
}

function broadcast() {
  if (typeof emit === 'function') {
    emit(snapshot());
  }
}

function normalizeVersion(value) {
  return String(value || '')
    .trim()
    .replace(/^v/i, '');
}

function compareSemver(a, b) {
  const pa = normalizeVersion(a).split('.').map((n) => Number(n) || 0);
  const pb = normalizeVersion(b).split('.').map((n) => Number(n) || 0);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i += 1) {
    const left = pa[i] || 0;
    const right = pb[i] || 0;
    if (left > right) return 1;
    if (left < right) return -1;
  }
  return 0;
}

async function checkGithubLatest() {
  const response = await fetch(LATEST_API, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': `Perch/${currentVersion()}`
    }
  });
  if (!response.ok) {
    throw new Error(`GitHub releases ${response.status}`);
  }
  const data = await response.json();
  const tag = normalizeVersion(data.tag_name || data.name || '');
  if (!tag) throw new Error('No release version found');
  return {
    version: tag,
    htmlUrl: data.html_url || RELEASES_URL
  };
}

function configureUpdater() {
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.allowDowngrade = false;

  autoUpdater.on('checking-for-update', () => {
    status = 'checking';
    errorMessage = null;
    broadcast();
  });

  autoUpdater.on('update-available', (info) => {
    status = 'available';
    latestVersion = normalizeVersion(info?.version) || latestVersion;
    githubSaysUpdate = true;
    errorMessage = null;
    broadcast();
  });

  autoUpdater.on('update-not-available', () => {
    // Keep GitHub "available" if the remote tag is newer but feed metadata is missing.
    if (githubSaysUpdate) {
      status = 'available';
      broadcast();
      return;
    }
    status = 'not-available';
    latestVersion = currentVersion();
    errorMessage = null;
    broadcast();
  });

  autoUpdater.on('download-progress', (progress) => {
    status = 'downloading';
    downloadProgress = {
      percent: Number(progress.percent) || 0,
      transferred: Number(progress.transferred) || 0,
      total: Number(progress.total) || 0
    };
    broadcast();
  });

  autoUpdater.on('update-downloaded', (info) => {
    status = 'ready';
    latestVersion = normalizeVersion(info?.version) || latestVersion;
    downloadProgress = null;
    errorMessage = null;
    broadcast();
  });

  autoUpdater.on('error', (error) => {
    status = 'error';
    errorMessage = error?.message || String(error);
    downloadProgress = null;
    broadcast();
  });
}

async function checkForUpdates() {
  status = 'checking';
  errorMessage = null;
  downloadProgress = null;
  broadcast();

  try {
    // Always compare against GitHub so button state is correct even in unpackaged runs.
    const remote = await checkGithubLatest();
    latestVersion = remote.version;
    const newer = compareSemver(remote.version, currentVersion()) > 0;
    githubSaysUpdate = newer;

    if (!newer) {
      status = 'not-available';
      broadcast();
      return snapshot();
    }

    status = 'available';
    broadcast();

    if (app.isPackaged) {
      // Ask electron-updater to resolve feed metadata for the eventual download/install.
      try {
        await autoUpdater.checkForUpdates();
        if (githubSaysUpdate && status === 'not-available') {
          status = 'available';
        }
      } catch (error) {
        // Keep the "available" state from the GitHub check; download can still be attempted.
        console.warn('electron-updater check failed:', error);
        status = 'available';
      }
      broadcast();
    }

    return snapshot();
  } catch (error) {
    status = 'error';
    errorMessage = error?.message || String(error);
    broadcast();
    return snapshot();
  }
}

async function startUpdate() {
  if (status === 'ready') {
    // isSilent=false, isForceRunAfter=true → replace current install and relaunch.
    autoUpdater.quitAndInstall(false, true);
    return snapshot();
  }

  if (!app.isPackaged) {
    await shell.openExternal(RELEASES_URL);
    return snapshot();
  }

  if (status !== 'available' && status !== 'error') {
    await checkForUpdates();
  }

  if (status !== 'available' && status !== 'error') {
    return snapshot();
  }

  try {
    status = 'downloading';
    downloadProgress = { percent: 0, transferred: 0, total: 0 };
    broadcast();
    await autoUpdater.downloadUpdate();
    return snapshot();
  } catch (error) {
    status = 'error';
    errorMessage = error?.message || String(error);
    downloadProgress = null;
    broadcast();
    return snapshot();
  }
}

function initUpdater(send) {
  emit = send;
  configureUpdater();

  // Delay first check so the window can come up first.
  setTimeout(() => {
    checkForUpdates().catch((error) => {
      console.error('Update check failed:', error);
    });
  }, 4000);

  // Occasional quiet re-check while the app stays open.
  setInterval(() => {
    if (status === 'downloading' || status === 'ready') return;
    checkForUpdates().catch(() => {});
  }, 6 * 60 * 60 * 1000);
}

module.exports = {
  initUpdater,
  checkForUpdates,
  startUpdate,
  getUpdateSnapshot: snapshot,
  RELEASES_URL
};
