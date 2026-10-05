import puppeteer from 'puppeteer';
import { spawn } from 'child_process';

const vite = spawn('npx', ['vite', '--port', '3456'], { stdio: 'pipe' });
await new Promise(resolve => setTimeout(resolve, 3000)); // wait for vite to start

const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.goto('http://localhost:3456');
await page.waitForSelector('main');
await new Promise(resolve => setTimeout(resolve, 3000)); // wait for animations

const inventory = await page.evaluate(() => {
  const sections = Array.from(document.querySelectorAll('nav, section, footer'));
  return sections.map(sec => {
    const tagName = sec.tagName.toLowerCase();
    const id = sec.id || tagName;
    
    // Extract Headings
    const headings = Array.from(sec.querySelectorAll('h1, h2, h3, h4')).map(h => h.innerText).filter(Boolean);
    
    // Extract Body text (paragraphs, spans not in links/headings)
    const walker = document.createTreeWalker(sec, NodeFilter.SHOW_TEXT, null, false);
    let textNodes = [];
    let node;
    while(node = walker.nextNode()) {
      if(node.parentElement.closest('a, h1, h2, h3, h4, script, style')) continue;
      const text = node.nodeValue.trim();
      if(text) textNodes.push(text);
    }
    const bodyText = Array.from(new Set(textNodes)); // Dedup
    
    // Extract links
    const links = Array.from(sec.querySelectorAll('a')).map(a => ({
      text: a.innerText.trim(),
      href: a.getAttribute('href')
    }));
    
    // Extract images
    const images = Array.from(sec.querySelectorAll('img')).map(img => img.getAttribute('src'));
    
    return { id, headings, bodyText, links, images };
  });
});

await browser.close();
vite.kill();

import fs from 'fs';
let md = '# Content Inventory\n\n';
for(const sec of inventory) {
  md += `## Section: ${sec.id}\n`;
  md += `### Headings\n${sec.headings.join('\n')}\n`;
  md += `### Body Text\n${sec.bodyText.join('\n')}\n`;
  md += `### Links\n${sec.links.map(l => `- [${l.text}](${l.href})`).join('\n')}\n`;
  md += `### Images\n${sec.images.map(img => `- ${img}`).join('\n')}\n\n`;
}

fs.writeFileSync('docs/content-inventory.md', md);
console.log('Inventory saved to docs/content-inventory.md');
