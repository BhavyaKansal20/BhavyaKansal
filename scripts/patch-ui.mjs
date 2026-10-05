import fs from 'fs';

function replaceClass(file, search, replacement) {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replaceAll(search, replacement);
  fs.writeFileSync(file, content);
}

// Update Projects.tsx
// Remove `glass-card` and complex gradients, use `bg-card border-border shadow-lg rounded-[2rem]`
replaceClass('src/components/Projects.tsx', 'bg-white/5 dark:bg-black/20 backdrop-blur-xl border-white/10 dark:border-white/10', 'bg-card border-border shadow-md rounded-3xl overflow-hidden');
replaceClass('src/components/Projects.tsx', 'glass-card', 'border border-border bg-card shadow-sm hover:shadow-lg transition-all rounded-[2rem]');

// Update About.tsx
// "apply the new card language"
replaceClass('src/components/About.tsx', 'bg-white/60 dark:bg-black/40 backdrop-blur-xl', 'bg-card border border-border rounded-3xl shadow-sm');
replaceClass('src/components/About.tsx', 'rounded-full px-4 py-2 border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/50', 'rounded-full px-4 py-2 border border-border bg-secondary text-secondary-foreground');

// Update FAQ.tsx
replaceClass('src/components/FAQ.tsx', 'bg-white/40 dark:bg-black/40 backdrop-blur-sm', 'bg-card border border-border rounded-2xl');

console.log('UI Patched');
