import fs from 'fs';
import path from 'path';

const banned = [
  'EdgeVision', 'LatentCraft', 'NeuroSeg', 'Multimodal RAG', '99.4%', '11.4ms', '85%', '0.92', 'Dice', '5M+', 'Speedup', 'Latency',
  '300+', '2023 — Present', 'dual-institute honors', 'edge-TPU', 'Undergraduate Researcher',
  'active collaborator in college department publications', 'TIET Center of AI Excellence',
  'Research & Deployment Lab', 'collegiate chapters', 'enterprise deployment focus', 'specialization in neural networks',
  'TensorRT', 'ONNX', 'DeepStream', 'Triton', 'Prometheus', 'Evidently', 'Weights & Biases', 'Qdrant', 'LangChain', 'Ollama',
  'example.com', 'Available for Q3/Q4 Initiatives', '© 2025', 'lh3.googleusercontent.com'
];

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  let failed = false;
  banned.forEach(str => {
    if (content.includes(str)) {
      console.error(`BANNED STRING FOUND: "${str}" in ${filePath}`);
      failed = true;
    }
  });
  return failed;
}

function walkDir(dir) {
  let hasError = false;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (walkDir(fullPath)) hasError = true;
    } else if (fullPath.endsWith('.html') || fullPath.endsWith('.js') || fullPath.endsWith('.css')) {
      if (checkFile(fullPath)) hasError = true;
    }
  }
  return hasError;
}

if (fs.existsSync('dist')) {
  if (walkDir('dist')) process.exit(1);
  console.log('Banned strings check passed!');
}
