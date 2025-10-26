const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'fiches');
let count = 0;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full);
    else if (ent.isFile() && full.endsWith('.html')) processFile(full);
  }
}

function processFile(file) {
  let s = fs.readFileSync(file, 'utf8');
  const before = s;
  // Replace <a ... href="javascript:history.back()">...<\/a>
  // If anchor already has class=, skip
  s = s.replace(/<a([^>]*?)href="javascript:history.back\(\)"([^>]*)>([\s\S]*?)<\/a>/gi, (m, g1, g2, inner) => {
    // if class already present in g1 or g2, return original
    if (/class\s*=/.test(g1 + g2)) return m;
    return `<a class="nav-back" href="javascript:history.back()">${inner}</a>`;
  });

  if (s !== before) {
    fs.writeFileSync(file, s, 'utf8');
    count++;
    console.log('Updated', file);
  }
}

walk(root);
console.log(`Done. Files updated: ${count}`);
