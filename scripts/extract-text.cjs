const fs = require('fs');
const files = [
  'Hero.tsx', 'TechStackScroller.tsx', 'About.tsx', 
  'Timeline.tsx', 'Projects.tsx', 'CodingDashboard.tsx', 
  'FAQ.tsx', 'Contact.tsx', 'Footer.tsx'
];

let md = '# Content Inventory\n\n';

for (const file of files) {
  const content = fs.readFileSync(`src/components/${file}`, 'utf-8');
  md += `## Section: ${file.replace('.tsx', '')}\n\n`;
  
  // Extract simple text roughly
  const matches = content.match(/>([^<]+)</g);
  if (matches) {
    const texts = matches.map(m => m.slice(1, -1).trim()).filter(m => m && !m.includes('{') && m.length > 2);
    md += '### Text\n' + [...new Set(texts)].map(t => `- ${t}`).join('\n') + '\n\n';
  }
}

fs.writeFileSync('docs/content-inventory.md', md);
console.log('Saved to docs/content-inventory.md');
