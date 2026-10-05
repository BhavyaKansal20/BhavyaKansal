# Preserved Effects

## 1. Navbar Two-Dot Element (Interactive Eyes)
- **File:** `src/components/Navbar.tsx`
- **Markup/JS:** Two circular div elements (`ref={leftEyeRef}`, `ref={rightEyeRef}`) representing eyes with inner pupils (`leftPupilRef`, `rightPupilRef`). A global `mousemove` event listener updates `transform: translate(x, y)` to track the cursor.
- **Verification:** `src/components/Navbar.tsx` has zero diffs for this logic against `ef7a871`. Verified via Playwright hover/move test.

## 2. Wordmark Logo
- **File:** `src/components/Navbar.tsx`
- **Markup/Classes:**
  ```tsx
  <Link to="/" className="text-xl font-bold z-10 flex-shrink-0 tracking-tight">
    <span className="text-foreground whitespace-nowrap">bhavya</span>
    <span className="text-muted-foreground whitespace-nowrap">kansal.dev</span>
  </Link>
  ```
- **Verification:** `src/components/Navbar.tsx` has zero diffs against `ef7a871`.

## 3. Hero Photo & Hover Effect
- **File:** `src/components/Hero.tsx`
- **Markup/Classes:** `<img>` with `className="w-full h-[440px] sm:h-[500px] md:h-[560px] object-cover object-top rounded-2xl transition-transform duration-500 group-hover:scale-[1.04]"`
- **Verification:** Verified in diff; only the main wrapper padding was changed, photo structure remains identical.

## 4. "जय श्री राम 🙏❤️" Caption Overlay
- **File:** `src/components/Hero.tsx`
- **Markup/Classes:**
  ```tsx
  <div className="absolute bottom-4 left-4 right-4 rounded-2xl p-6 text-white">
    <p className="text-lg font-semibold text-white/80">AI/ML · Research & Collaborations</p>
    <p className="text-sm text-white/80 mt-2">जय श्री राम 🙏❤️</p>
  </div>
  ```
- **Verification:** Identical to original.

## 5. Ctrl+K Pill
- **File:** `src/components/Hero.tsx`
- **Markup/Classes:**
  ```tsx
  <div className="bg-gradient-to-r from-gray-100/95 to-gray-200/90 dark:from-gray-900/95 dark:to-black/90 backdrop-blur-sm text-gray-900 dark:text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg border border-black/20 dark:border-white/10">
    Press <kbd className="px-2 py-0.5 mx-1 bg-gray-300/60 dark:bg-gray-800/60 border border-black/20 dark:border-white/20 rounded text-xs font-semibold">Ctrl+K</kbd> to open the AI assistant
  </div>
  ```
- **Verification:** Identical to original.
