const fs = require('fs');
const path = 'C:/Users/GPA (PC)/Documents/GPA SITE OFICIAL/poytara.com/poytara.com/index.html';

if (!fs.existsSync(path)) {
  console.log('Path does not exist:', path);
  // check other paths
  process.exit(1);
}

const html = fs.readFileSync(path, 'utf8');
const regex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
let match;
let allCss = '';

while ((match = regex.exec(html)) !== null) {
  allCss += match[1] + '\n\n';
}

fs.writeFileSync('poytara_extracted.css', allCss, 'utf8');
console.log('Successfully wrote poytara_extracted.css, bytes:', allCss.length);
