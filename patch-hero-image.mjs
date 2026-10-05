import fs from 'fs';
let content = fs.readFileSync('src/components/Hero.tsx', 'utf-8');
content = content.replace(
  '<img\n                src="/Bhavya-Kansal-PFP.jpg?v=20260509"',
  '<img\n                src="/Bhavya-Kansal-PFP.jpg"\n                srcSet="/Bhavya-Kansal-PFP.jpg 1x"\n                width="560" height="560"'
);
// Remove opacity-0 start if it exists on the image container
content = content.replace('scroll-animate-delay-2" : "opacity-0"', 'scroll-animate-delay-2" : ""');
fs.writeFileSync('src/components/Hero.tsx', content);
