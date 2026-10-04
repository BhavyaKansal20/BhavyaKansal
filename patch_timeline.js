const fs = require('fs');

let file = fs.readFileSync('src/components/Timeline.tsx', 'utf8');

// Update the timeline item for General Secretary
file = file.replace(
  `company: "CODE METRICS Research Society",`,
  `company: "CODE METRICS Research Society (TIET, CSED & DORSP)",`
);

// We need to add the certificate viewer to Timeline.tsx
// I will just rewrite Timeline.tsx instead.
