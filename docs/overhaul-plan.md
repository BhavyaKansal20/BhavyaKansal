# Overhaul Plan

## 1. Stack Decision
The project is currently a **Vite + React SPA**. 
Given the short timeline and the request for "lowest-risk path" to meet the criteria, migrating to Astro or Next.js SSG is possible, but rewriting the entire routing and build setup might introduce severe regression risks. 
**Decision:** Keep the Vite + React stack but optimize it heavily to mimic SSG performance (or use Vite SSG plugins). We will focus on:
1. Drastically reducing the JS bundle (code-splitting).
2. Optimizing images (WebP/AVIF).
3. Stripping out all heavy CSS/JS animations in favor of static, clean CSS.
4. If necessary, we will convert to Next.js static export if Vite optimization fails, but first, we will execute the "delete code" strategy to see if we can hit the budgets with Vite.

*Wait*, the prompt explicitly states: "If it is a client-rendered SPA ... the page content must be statically pre-rendered so crawlers... get real HTML. Choose the lowest-risk path: Prefer Astro ... or Next.js static export".
Since it is Vite React, the lowest risk path to *static pre-rendering* without a full rewrite is actually using a plugin like `vite-plugin-ssg` or migrating to Next.js. I will evaluate the complexity. Since it's a single-page portfolio, Next.js static export is highly feasible and preferred by Big Tech. However, rewriting to Next.js requires changing routing.
**Revised Decision:** We will stay on Vite but add **Pre-rendering** via `@prerenderer/rollup-plugin` or `vite-plugin-prerender` to generate static HTML for the index route, meeting the SEO and fast LCP requirements.

## 2. Phases
- **Phase 1: Architecture & Pre-rendering:** Implement static HTML generation for Vite. Remove unused dependencies.
- **Phase 2: Design System & Styling:** Overhaul `index.css`. Implement strict tokens, dark/light theme correctly, remove all glassmorphism and blobs.
- **Phase 3: Content & Layout:** Rebuild Hero, Proof Strip, Projects, Experience, FAQ according to the mobile-first spec.
- **Phase 4: Chatbot & Lazy Loading:** Code-split the chatbot. Add grounding logic.
- **Phase 5: SEO, Accessibility & Audits:** Add structured data, semantic HTML, run axe-core & lighthouse.

## 3. Risks
- Chatbot relies on existing state/context. Lazy loading it might cause interaction delays.
- Static pre-rendering Vite might struggle with some client-side-only Radix UI components (they might need to be deferred to hydration).
