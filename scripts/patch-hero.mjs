import fs from 'fs';
let content = fs.readFileSync('src/components/Hero.tsx', 'utf-8');

// The instruction: "Use the typography from the design instead: self-hosted variable fonts (Plus Jakarta Sans or Inter Tight for headings, Inter for body, JetBrains Mono for tags)."
// Hero headline must be "strong weight and tight tracking".
// "Apply the new design's container (large rounded section, ember gradient glow, grain)"

content = content.replace(
  `className="min-h-[88vh] bg-background relative overflow-hidden pt-28 sm:pt-24 pb-16"`,
  `className="min-h-[88vh] relative overflow-hidden pt-32 sm:pt-28 pb-16 mx-4 sm:mx-6 lg:mx-8 rounded-[3rem] mt-4"`
);

// Buttons: "pill buttons with trailing arrow circle"
content = content.replace(
  `className="rounded-full gap-2 px-8 py-6 text-base font-medium shadow-lg shadow-black/10 hover:shadow-xl transition-shadow"`,
  `className="rounded-full gap-3 pl-8 pr-3 py-6 text-base font-semibold shadow-lg hover:shadow-primary/20 hover:shadow-xl transition-all group bg-primary hover:bg-primary/90 text-primary-foreground"`
);
content = content.replace(
  `<ArrowRight className="w-5 h-5" />`,
  `<div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors"><ArrowRight className="w-5 h-5" /></div>`
);

content = content.replace(
  `className="rounded-full gap-2 px-8 py-6 text-base font-medium border-2 border-black dark:border-white hover:bg-black hover:text-white hover:border-white dark:hover:bg-white dark:hover:text-black dark:hover:border-black"`,
  `className="rounded-full gap-3 pl-8 pr-3 py-6 text-base font-semibold border-2 border-border hover:bg-secondary transition-all group"`
);
content = content.replace(
  `<Download className="w-5 h-5" />`,
  `<div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center group-hover:bg-secondary-foreground/10 transition-colors"><Download className="w-5 h-5" /></div>`
);

// Font classes
content = content.replace(
  `className="display-heading text-[2.35rem] leading-[1.05] sm:text-5xl md:text-6xl font-bold"`,
  `className="font-display text-[2.35rem] leading-[1.05] sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground"`
);

// Portrait - rule: "framed rounded portrait card on the right with its dark border/shadow, and the bottom dark gradient overlay with caption: AI/ML · Research & Collaborations."
// Also rule: "The hero photo. Same image file, same crop"
// "The hover effect: transition-transform duration-500 group-hover:scale-[1.04]"
// The user explicitly stated "SAME TO SAME" for the image, its crop, hover, and overlay caption. I will not modify the image tag structure much.

// Write back
fs.writeFileSync('src/components/Hero.tsx', content);
console.log('Hero.tsx patched');
