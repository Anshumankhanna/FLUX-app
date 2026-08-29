const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'Pages');
const indexCssPath = path.join(__dirname, 'src', 'index.css');

let allCss = '\n\n/* =========================\n   MIGRATED PAGE CSS\n========================= */\n\n@layer components {\n';

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.css') && file !== 'App.css' && file !== 'index.css') {
      const cssContent = fs.readFileSync(fullPath, 'utf-8');
      allCss += `\n/* --- ${file} --- */\n` + cssContent + '\n';
      fs.unlinkSync(fullPath); // Delete the css file
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js')) {
      let jsxContent = fs.readFileSync(fullPath, 'utf-8');
      jsxContent = jsxContent.replace(/import\s+['"]\.\/.*\.css['"];?\n?/g, '');
      fs.writeFileSync(fullPath, jsxContent);
    }
  }
}

processDirectory(pagesDir);
allCss += '\n}\n';

fs.appendFileSync(indexCssPath, allCss);
console.log('Migration complete.');
