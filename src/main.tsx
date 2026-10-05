import { createRoot, hydrateRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root")!;
const app = (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
    <App />
  </ThemeProvider>
);

if (rootElement.innerHTML.trim().length > 0 && rootElement.innerHTML.indexOf('data-reactroot') === -1) {
  // SSR was run, hydrate
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}
