#!/usr/bin/env node
// testing.js
// Simple Node script to test OpenRouter API key (VITE_OPENROUTER_API_KEY).
// Usage:
//  - Set env var: VITE_OPENROUTER_API_KEY=your_key node testing.js
//  - Or ensure there's a .env.local in project root containing VITE_OPENROUTER_API_KEY=...

import fs from 'fs';
import path from 'path';

function readDotEnv(dotenvPath) {
  try {
    const content = fs.readFileSync(dotenvPath, 'utf8');
    const lines = content.split(/\r?\n/);
    for (const line of lines) {
      const m = line.match(/^\s*VITE_OPENROUTER_API_KEY\s*=\s*(.+)\s*$/);
      if (m) return m[1].trim();
    }
  } catch (err) {
    return null;
  }
  return null;
}

async function main() {
  let apiKey = process.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) {
    const envPath = path.resolve(process.cwd(), '.env.local');
    apiKey = readDotEnv(envPath);
  }

  if (!apiKey) {
    console.error('OpenRouter API key not found. Set VITE_OPENROUTER_API_KEY or add .env.local');
    process.exit(1);
  }

  const prompt = `Test connection: please reply with exactly "OpenRouter reachable" and current timestamp.`;
  const url = `https://openrouter.ai/api/v1/chat/completions`;

  const payload = {
    model: process.env.VITE_OPENROUTER_MODEL || 'openrouter/auto',
    messages: [
      { role: 'user', content: prompt }
    ],
    temperature: 0.3,
  };

  try {
    // Node 18+ has global fetch. If older Node, user should run with Node 18+ or install node-fetch.
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.VITE_SITE_URL || 'http://localhost:8080',
        'X-Title': 'Bhavya Kansal Portfolio',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error('API returned error status:', res.status);
      const txt = await res.text();
      console.error('Error body:', txt);
      process.exit(2);
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    console.log('Raw API response JSON:\n', JSON.stringify(data, null, 2));
    if (text) {
      console.log('\nExtracted text:\n', text.trim());
    } else {
      console.warn('\nNo textual candidate found in response.');
    }
  } catch (err) {
    console.error('Request failed:', err);
    process.exit(3);
  }
}

main();
