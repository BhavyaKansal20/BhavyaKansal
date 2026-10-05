import fs from 'fs';
let content = fs.readFileSync('src/components/Timeline.tsx', 'utf-8');

// Change useScrollAnimation calls in Timeline.tsx
content = content.replace(
  'const { ref: timelineRef, isVisible } = useScrollAnimation();',
  'const { ref: timelineRef, isVisible } = useScrollAnimation({ rootMargin: "0px 0px 200px 0px", threshold: 0 });'
);
content = content.replace(
  'const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();',
  'const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation({ rootMargin: "0px 0px 200px 0px", threshold: 0 });'
);

// Reduce stagger: it was calculated using index * something. Let's find how delayMs was computed.
// E.g. const delayMs = index * 200; Let's change it to index * 40;
content = content.replace(/index \* \d+/g, 'index * 40');

// Reduce duration to 300ms, and add motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100
content = content.replaceAll('duration-700', 'duration-300 motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100');
content = content.replaceAll('duration-500', 'duration-300 motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100');

fs.writeFileSync('src/components/Timeline.tsx', content);
console.log('Timeline speed patched.');
