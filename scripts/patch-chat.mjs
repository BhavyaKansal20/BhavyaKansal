import fs from 'fs';

let cmd = fs.readFileSync('src/components/CommandPalette.tsx', 'utf-8');
cmd = cmd.replaceAll('bg-white/80 dark:bg-black/80 backdrop-blur-3xl', 'bg-card border-border shadow-2xl rounded-2xl');
cmd = cmd.replaceAll('bg-black/5 dark:bg-white/10', 'bg-secondary');
fs.writeFileSync('src/components/CommandPalette.tsx', cmd);

let fab = fs.readFileSync('src/components/MobileFAB.tsx', 'utf-8');
fab = fab.replaceAll('bg-gradient-to-r from-indigo-500 to-purple-600', 'bg-primary');
fab = fab.replaceAll('shadow-indigo-500/25', 'shadow-primary/25');
fs.writeFileSync('src/components/MobileFAB.tsx', fab);

console.log('Chat Patched');
