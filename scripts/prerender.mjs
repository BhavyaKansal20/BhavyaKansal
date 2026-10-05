import fs from 'fs';

const htmlTemplate = fs.readFileSync('index.html', 'utf-8');

const prerenderedHero = `
  <section class="min-h-[88vh] relative overflow-hidden pt-32 pb-16 mx-4 rounded-[3rem] mt-4" style="visibility: hidden;">
    <div>
      <span>PORTFOLIO — BHAVYA KANSAL</span>
      <h1>Building production-ready AI systems across machine learning, computer vision & intelligent automation.</h1>
      <p>Hi, I'm Bhavya Kansal. I architect and build scalable AI systems — machine-learning models, multimodal applications, and deep-tech solutions for real-world engineering challenges.</p>
      <p>Based in Patiala, Punjab — pursuing B.Tech in Data Science & AI at TIET.</p>
    </div>
  </section>
`;

const updatedHtml = htmlTemplate.replace('<div id="root"></div>', `<div id="root">\n${prerenderedHero}\n</div>`);
fs.writeFileSync('index.html', updatedHtml);
console.log('Prerender HTML injected');
