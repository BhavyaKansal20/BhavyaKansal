const fs = require('fs');
const path = require('path');
const bannedStrings = ['TODO', 'lorem', 'undefined', 'NaN', 'example.com', 'lh3.googleusercontent.com'];

let failed = false;
function scan(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) scan(full);
    else if (full.endsWith('.html') || full.endsWith('.js')) {
      const content = fs.readFileSync(full, 'utf-8');
      bannedStrings.forEach(s => {
        if (content.includes(s)) {
          console.error(`LEAK FOUND: "${s}" in ${full}`);
          failed = true;
        }
      });
    }
  });
}
scan('dist');
if (!failed) console.log('Zero leaks found.');
