const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const ROOT = path.resolve(__dirname);
const DIST_DIR = path.join(ROOT, 'dist');
const ZIP_NAME = 'page-fishing-v1.0.0.zip';
const ZIP_PATH = path.join(ROOT, ZIP_NAME);

console.log('Building production release package for Page Fishing...');

// 1. Check required release files
const requiredFiles = [
  'manifest.json',
  'background.js',
  'fishing.js',
  'LICENSE',
  'README.md',
  'icons/icon16.png',
  'icons/icon32.png',
  'icons/icon48.png',
  'icons/icon128.png'
];

for (const rel of requiredFiles) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) {
    console.error(`ERROR: Missing required file ${rel}`);
    process.exit(1);
  }
}
console.log('All required release files exist.');

// 2. Syntax check
execSync('node --check fishing.js', { stdio: 'inherit' });
execSync('node --check background.js', { stdio: 'inherit' });
console.log('Syntax checks passed.');

// 3. Zero emojis audit
const emojiRe = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
const textFiles = ['manifest.json', 'background.js', 'fishing.js', 'README.md', 'LICENSE'];
for (const rel of textFiles) {
  const content = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const match = content.match(emojiRe);
  if (match) {
    console.error(`ERROR: Emoji detected in ${rel}: ${match[0]}`);
    process.exit(1);
  }
}
console.log('Zero emoji verification: PASS');

// 4. Staging into dist/
if (fs.existsSync(DIST_DIR)) {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DIST_DIR, { recursive: true });
fs.mkdirSync(path.join(DIST_DIR, 'icons'), { recursive: true });

for (const rel of requiredFiles) {
  const src = path.join(ROOT, rel);
  const dest = path.join(DIST_DIR, rel);
  fs.copyFileSync(src, dest);
}
console.log(`Staged ${requiredFiles.length} files into dist/`);

// 5. Create zip archive using .NET ZipFile
if (fs.existsSync(ZIP_PATH)) {
  fs.unlinkSync(ZIP_PATH);
}

execSync(`powershell -NoProfile -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory('${DIST_DIR}', '${ZIP_PATH}')"`, {
  stdio: 'inherit'
});

const stats = fs.statSync(ZIP_PATH);
console.log(`Successfully built ${ZIP_NAME} (${Math.round(stats.size / 1024)} KB)`);
console.log('Package is store-ready for Chrome Web Store and Edge Add-ons!');
