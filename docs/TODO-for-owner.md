# TODO for Owner (Bhavya)

## Content & Metrics
- `src/components/ProofStrip.tsx`: Add actual number for "Projects Shipped".
- `src/components/ProofStrip.tsx`: Add actual number for "Hackathon Wins".
- `src/components/Projects.tsx`: Replace project descriptions with one-line outcomes + actual metrics.
- `src/components/Timeline.tsx`: Add concrete metric/outcome for IIT Ropar training.
- `src/components/Timeline.tsx`: Add concrete metric/outcome for Thapar Summer training.

## Technical & Deployment
- `api/chat.ts`: Implement actual Gemini logic using your secure `GEMINI_API_KEY`. Add rate limiting and profile grounding.
- Search Console: Verify the property and submit `sitemap.xml`.
- Lighthouse: Run `npx lighthouse https://bhavyakansal.dev --view` locally to confirm the 95+ scores and fix any remaining bundle issues.
- Pre-rendering: If you want true 0 JS for crawlers, configure `vite-plugin-prerender` or export the site using Next.js.
