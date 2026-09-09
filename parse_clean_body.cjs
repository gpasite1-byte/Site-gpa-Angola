const fs = require('fs');
const body = fs.readFileSync('full_poytara_body_clean.html', 'utf8');

// Parse top level sections
const regex = /<(header|section|footer)[^>]*>([\s\S]*?)<\/\1>/gi;
let m;
let i = 0;
while ((m = regex.exec(body)) !== null) {
  console.log(`\n================== SECTION ${i++} : <${m[1]}> ==================`);
  console.log(m[0].slice(0, 500));
}
