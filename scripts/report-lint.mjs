import fs from 'fs';
import path from 'path';

const reportPath = 'docs/FINAL-REPORT.md';
if (!fs.existsSync(reportPath)) {
  console.error('FINAL-REPORT.md not found!');
  process.exit(1);
}

const content = fs.readFileSync(reportPath, 'utf-8');
const rows = content.split('\n').filter(line => line.startsWith('|') && !line.includes('---'));

let failed = false;

rows.forEach(row => {
  const cols = row.split('|').map(c => c.trim());
  if (cols.length >= 4) {
    const status = cols[2];
    const evidence = cols[3];
    
    if (status === 'DONE') {
      const match = evidence.match(/`([^`]+)`/);
      if (match) {
        let filePath = match[1];
        if (!fs.existsSync(filePath)) {
          // It might be a directory?
          if (!fs.existsSync(path.dirname(filePath))) {
            console.error(`ERROR: Item marked DONE but evidence file missing: ${filePath}`);
            failed = true;
          }
        } else {
          const stat = fs.statSync(filePath);
          if (stat.size === 0) {
            console.error(`ERROR: Evidence file is empty: ${filePath}`);
            failed = true;
          }
        }
      }
    }
  }
});

if (failed) {
  process.exit(1);
}
console.log('Report Lint Passed!');
