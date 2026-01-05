const { rcedit } = require('rcedit');
const path = require('path');

exports.default = async function(context) {
  // Only run for Windows
  if (context.electronPlatformName !== 'win32') {
    return;
  }

  const exePath = path.join(context.appOutDir, `${context.packager.appInfo.productFilename}.exe`);
  const iconPath = path.join(context.packager.projectDir, 'Logo.ico');

  console.log('Setting icon on executable:', exePath);
  console.log('Using icon:', iconPath);

  try {
    await rcedit(exePath, { icon: iconPath });
    console.log('Icon successfully embedded!');
  } catch (err) {
    console.error('Failed to set icon:', err);
  }
};
