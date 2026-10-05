import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf-8');

html = html.replace(/<title>.*<\/title>/, '<title>Bhavya Kansal | AI/ML Engineer - Computer Vision & GenAI</title>');

// Remove any existing meta description, og tags to replace them cleanly
html = html.replace(/<meta name="description".*?>/, '');
html = html.replace(/<meta property="og:.*?>/g, '');

const metadata = `
    <meta name="description" content="Portfolio of Bhavya Kansal, an AI/ML Engineer specializing in Computer Vision, Generative AI, and deep-tech system architecture." />
    <meta property="og:title" content="Bhavya Kansal | AI/ML Engineer" />
    <meta property="og:description" content="Portfolio of Bhavya Kansal, an AI/ML Engineer specializing in Computer Vision, Generative AI, and deep-tech system architecture." />
    <meta property="og:image" content="https://bhavyakansal.dev/og-image.png" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://bhavyakansal.dev" />
    <link rel="canonical" href="https://bhavyakansal.dev" />
    <meta name="theme-color" content="#0B0908" media="(prefers-color-scheme: dark)" />
    <meta name="theme-color" content="#F7F3EE" media="(prefers-color-scheme: light)" />
    <!-- Favicon Set -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "mainEntity": {
        "@type": "Person",
        "name": "Bhavya Kansal",
        "alternateName": "Bhavya Kansal",
        "url": "https://bhavyakansal.dev",
        "jobTitle": "AI/ML Engineer",
        "sameAs": [
          "https://github.com/BhavyaKansal20",
          "https://linkedin.com/in/bhavyakansal20"
        ]
      }
    }
    </script>
`;

html = html.replace('</head>', `${metadata}</head>`);
html = html.replace('<html lang="en">', '<html lang="en" dir="ltr">');

fs.writeFileSync('index.html', html);
console.log('SEO metadata patched.');
