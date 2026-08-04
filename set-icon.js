const { rcedit } = require('rcedit');
const path = require('path');
const fs = require('fs');

const iconPath = path.join(__dirname, 'Logo.ico');

// List of possible executable locations
const exePaths = [
  path.join(__dirname, 'dist', 'win-unpacked', 'Perch.exe'),
  path.join(__dirname, 'dist', 'Perch-win32-x64', 'Perch.exe'),
];

console.log('Setting icon:', iconPath);

const setIconPromises = exePaths
  .filter(exePath => {
    const exists = fs.existsSync(exePath);
    if (exists) {
      console.log('Found executable:', exePath);
    }
    return exists;
  })
  .map(exePath => {
    return rcedit(exePath, { icon: iconPath })
      .then(() => {
        console.log('Icon successfully set for:', exePath);
      })
      .catch((err) => {
        console.error('Error setting icon for', exePath, ':', err);
      });
  });

if (setIconPromises.length === 0) {
  console.log('No executables found to set icon on.');
} else {
  Promise.all(setIconPromises).then(() => {
    console.log('Done!');
  });
}
