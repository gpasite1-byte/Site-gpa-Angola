const fs = require('fs');
const html = fs.readFileSync('C:/Users/GPA (PC)/Documents/GPA SITE OFICIAL/poytara.com/poytara.com/index.html', 'utf8');

const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]).join('\n');

const targets = ['btn-default', 'products-box', 'box-iframe-dynamic', 'footer-column', 'copyright-bar', 'dnavbar', 'nav-bar', 'topbar', 'banner-slider', 'col-prod', 'menu-icon', 'circle'];

targets.forEach(t => {
  const reg = new RegExp(`[^}]*\\.${t}[^{]*\\{[^}]*\\}`, 'gi');
  const matches = styles.match(reg);
  console.log(`\n=== Target: ${t} ===`);
  if (matches) {
    matches.slice(0, 4).forEach(m => console.log(m.replace(/\s+/g, ' ')));
  }
});
