const fs = require('fs');
const path = require('path');

const assetsDir = path.join(
  __dirname,
  '..',
  'node_modules',
  '@react-navigation',
  'drawer',
  'lib',
  'module',
  'views',
  'assets',
);

if (!fs.existsSync(assetsDir)) {
  process.exit(0);
}

const files = fs.readdirSync(assetsDir);
const androidFiles = files.filter((f) => f.endsWith('.android.png'));

androidFiles.forEach((androidFile) => {
  const genericName = androidFile.replace('.android.png', '.png');
  const genericPath = path.join(assetsDir, genericName);
  if (!fs.existsSync(genericPath)) {
    fs.copyFileSync(path.join(assetsDir, androidFile), genericPath);
  }
});
