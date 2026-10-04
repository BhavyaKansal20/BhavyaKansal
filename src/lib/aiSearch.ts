// Secure Client for AI Chatbot
// Calls the serverless edge function rather than exposing the API key to the client.

export const queryAI = async (query: string): Promise<string> => {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data.response || data.text; // Depends on backend implementation
  } catch (err) {
    console.error("AI Query Error:", err);
    return "I am having trouble connecting to my backend. Please email Bhavya directly.";
  }
};
