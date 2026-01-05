const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Remove the ELECTRON_RUN_AS_NODE env var that VSCode sets
delete process.env.ELECTRON_RUN_AS_NODE;

// Find the electron executable
const electronPath = require('electron');

// Spawn electron with the current directory
const child = spawn(electronPath, ['.'], {
  stdio: 'inherit',
  cwd: __dirname,
  env: process.env
});

child.on('close', (code) => {
  process.exit(code);
});
