export const config = { runtime: 'edge' };

// Simple in-memory rate limiter for Edge (Note: state resets on cold starts)
const rateLimitMap = new Map();

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  
  // Origin check
  const origin = req.headers.get('origin');
  if (origin && !origin.includes('localhost') && !origin.includes('bhavyakansal.dev')) {
    return new Response('Forbidden Origin', { status: 403 });
  }

  // Rate Limiting
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const now = Date.now();
  const windowMs = 60000;
  const maxRequests = 5;
  const rl = rateLimitMap.get(ip) || { count: 0, startTime: now };
  if (now - rl.startTime > windowMs) {
    rl.count = 1;
    rl.startTime = now;
  } else {
    rl.count++;
  }
  rateLimitMap.set(ip, rl);
  if (rl.count > maxRequests) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please email me directly.' }), { status: 429 });
  }

  try {
    const body = await req.json();
    const message = body.message;
    if (!message || message.length > 500) {
      return new Response(JSON.stringify({ error: 'Invalid message length' }), { status: 400 });
    }

    if (process.env.VITE_CHAT_MOCK === '1') {
      return new Response(JSON.stringify({ reply: 'Mock response: I am a mock assistant. Email me at kansalbhavya27@gmail.com!' }), { status: 200 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    if (!apiKey) {
      return new Response(JSON.stringify({ reply: 'Chat is currently unavailable. Please reach out via email: kansalbhavya27@gmail.com' }), { status: 200 });
    }

    // Call Gemini API (fetch)
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: `You are Bhavya Kansal's AI assistant. Ground your answers strictly in his portfolio facts. Be concise. User asks: ${message}` }] }]
      }),
      signal: AbortSignal.timeout(10000)
    });
    
    const data = await geminiRes.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble thinking right now. Please email me.";
    return new Response(JSON.stringify({ reply }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ reply: 'An error occurred. Please email kansalbhavya27@gmail.com' }), { status: 500 });
  }
}
