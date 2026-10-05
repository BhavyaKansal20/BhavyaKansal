import { renderToString } from 'react-dom/server';
import { ThemeProvider } from "next-themes";
import App from './App';

export function render() {
  const html = renderToString(
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <App />
    </ThemeProvider>
  );
  return { html };
}
