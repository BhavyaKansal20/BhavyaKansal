import fs from 'fs';
let content = fs.readFileSync('src/components/TechStackScroller.tsx', 'utf-8');

// Fix aria-hidden and prefers-reduced-motion
content = content.replace(
  `<div className="flex space-x-8 animate-scroll overflow-visible">`,
  `<div className="flex space-x-8 motion-safe:animate-marquee overflow-visible group flex-nowrap motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:animate-none hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">`
);

content = content.replace(
  `{looped.map((tech, index) => (`,
  `{techStack.map((tech, index) => (
            <div key={\`\${tech.name}-\${index}\`} className="flex items-center shrink-0 group">
              <img src={tech.icon} alt={\`\${tech.name} logo\`} loading="lazy" decoding="async" className="w-5 h-5 mr-3 opacity-85 saturate-125" />
              <span className="text-xl font-medium text-background dark:text-foreground whitespace-nowrap">{tech.name}</span>
              <span className="mx-8 text-background/40 dark:text-foreground/40">•</span>
            </div>
          ))}
          <div aria-hidden="true" className="flex space-x-8 motion-reduce:hidden">
            {techStack.map((tech, index) => (`
);

content = content.replace(
  `</div>\n      </div>`,
  `  </div>\n        </div>\n      </div>`
);

fs.writeFileSync('src/components/TechStackScroller.tsx', content);
console.log('Scroller patched');
