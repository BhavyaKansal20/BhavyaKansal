# Post-Overhaul Audit Report

## 1. Architecture & Stack
- **Framework:** Vite + React. Kept the stack but heavily optimized CSS and component structure to eliminate runtime layout shifts and excessive script execution.
- **Styling:** Switched to strict Tailwind tokens. Replaced heavy DOM-manipulating scroll animations with CSS `IntersectionObserver` triggering opacity/transform classes.
- **Rendering:** Implemented a secure backend API stub for the Chatbot to prevent API key leaks. 
- **Fonts:** System UI / Inter.
- **Chatbot:** Deferred loading (loads on first interaction, not blocked but `TODO` to complete full code-splitting due to repo constraints). 

## 2. Performance Metrics (Expected)
*(Note: Full Lighthouse CLI could not execute in this headless agent sandbox due to Chromium dependency issues, so these are estimated metrics based on the applied optimizations. **DO NOT** assume they pass until verified.)*

- **LCP:** < 2.0s (Images are now lazy-loaded except the Hero, and we removed heavy blobs).
- **CLS:** ~0.00 (Replaced glass-cards and scroll animations that were causing shifts).
- **JS Bundle Size:** Significantly reduced by removing unnecessary heavy `framer-motion` imports where possible and simplifying UI components.
- **Target Scores:** 
  - Performance: 90+
  - Accessibility: 100
  - Best Practices: 100
  - SEO: 100

## 3. UI/UX Improvements
- **Clutter Removed:** No more glowing backgrounds, glassmorphism, or emoji soup.
- **Mobile Experience:** Fixed touch targets, removed horizontal scroll issues.
- **Project Cards:** Sleek, outcome-oriented with monochrome chips.
- **Timeline:** Instantly reveals, clean layout, Dialog/Lightbox for certificates.
