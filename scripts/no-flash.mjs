import fs from 'fs';
const html = fs.readFileSync('index.html', 'utf-8');
const noFlashScript = `
    <script>
      (function() {
        try {
          var d = document.documentElement, c = d.classList;
          c.remove('light', 'dark');
          var e = localStorage.getItem('theme');
          if ('system' === e || (!e && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            c.add('dark');
          } else if (e) {
            c.add(e);
          } else {
            c.add('dark'); // default dark
          }
        } catch (e) {}
      })();
    </script>
`;
if (!html.includes('prefers-color-scheme')) {
  fs.writeFileSync('index.html', html.replace('</head>', `${noFlashScript}</head>`));
  console.log('No-flash script added');
}
