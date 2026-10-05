import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  /import \{\s*typeof window !== "undefined" \? createBrowserRouter : createMemoryRouter,\s*RouterProvider,\s*Outlet,\s*ScrollRestoration,\s*\} from "react-router-dom";/m,
  'import { RouterProvider, createBrowserRouter, createMemoryRouter, Outlet, ScrollRestoration } from "react-router-dom";'
);

content = content.replace(
  'const router = typeof window !== "undefined" ? createBrowserRouter : createMemoryRouter([',
  `const createRouter = typeof window !== "undefined" ? createBrowserRouter : createMemoryRouter;
const router = createRouter([`
);

fs.writeFileSync('src/App.tsx', content);
