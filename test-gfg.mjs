import fs from 'fs';
const html = fs.readFileSync('gfg.html', 'utf8');
const match = html.match(/total_problems_solved\\?":(\d+)/);
console.log(match ? match[1] : null);
