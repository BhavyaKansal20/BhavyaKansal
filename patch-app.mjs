import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');
content = content.replace('import CommandPalette from "@/components/CommandPalette";', 'import React, { Suspense } from "react";\nconst CommandPalette = React.lazy(() => import("@/components/CommandPalette"));');
content = content.replace('<CommandPalette />', '<Suspense fallback={null}><CommandPalette /></Suspense>');
fs.writeFileSync('src/App.tsx', content);
