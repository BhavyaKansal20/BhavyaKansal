# Initial Audit Report

## 1. Architecture & Stack
- **Framework:** Vite + React (SPA)
- **Styling:** Tailwind CSS + custom CSS (`index.css`) with heavy animations, glassmorphism, and radial gradients.
- **Rendering:** Pure client-side rendering (CSR). This is detrimental to SEO because crawlers without JS capabilities won't see the content, though Googlebot usually executes JS, it's slower.
- **Fonts:** System-UI (recently patched from Times New Roman) but lacking strict typography tokens and font-display optimizations.
- **Dependencies:** Heavily relies on `@radix-ui/*`, `lucide-react`, and large images.

## 2. Performance Baselines (Simulated/Observed)
- **LCP (Largest Contentful Paint):** High (> 2.5s) due to heavy JS execution before rendering and unoptimized large hero images (`Bhavya-Kansal-PFP.jpg`).
- **CLS (Cumulative Layout Shift):** Moderate. Images lack explicit width/height in some places, and late-loading CSS/JS shifts content.
- **JS Bundle Size:** Large (> 500KB) due to heavy UI libraries and full client-side routing/state.
- **Lighthouse Scores (Simulated Mobile):**
  - Performance: ~60-70
  - Accessibility: ~85
  - Best Practices: ~80
  - SEO: ~85

## 3. UI/UX & Design Flaws
- **Clutter:** Too many glowing blobs, gradients, and overlapping elements (glass-card borders, spotlights).
- **Mobile Experience:** Poor touch targets, excessive animations on scroll causing jank, horizontal scrolling issues.
- **Typography:** Lacks hierarchy. The previous "Times New Roman" was removed, but it still needs a cohesive fluid type scale.
- **Chatbot:** `CommandPalette.tsx` is bloated and loads immediately. It should be deferred.
- **Project Cards:** Heavy and cluttered with unnecessary metrics chips and glass backgrounds.

## 4. Required Optimizations
- Keep Vite/React but optimize it heavily (code-splitting, asset compression, lazy loading).
- Remove excessive CSS animations and glowing effects.
- Implement a clean, single-accent color premium design.
- Optimize images using proper formats and lazy loading.
- Move chatbot to a deferred chunk.
