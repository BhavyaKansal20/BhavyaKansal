// Resume context for AI assistant
const RESUME_CONTEXT = `PERSONAL INFORMATION & CONTACT:
Name: Bhavya Kansal
Role: AI Engineer, ML Researcher & Founder
Education: Diploma in CSE at Thapar Polytechnic College (2023-2026), Summer Training in Python/AI-ML/Cybersecurity (Jun-Aug 2025), AI/ML Intern Trainee at IIT & NIELIT Ropar (Jan-Jul 2026), B.Tech DSAI at TIET (2026-2029)
Email: kansalbhavya27@gmail.com
LinkedIn: linkedin.com/in/kansal0920
GitHub: github.com/BhavyaKansal20
Portfolio: bhavyakansal.dev
PROFESSIONAL SUMMARY:
AI engineer focused on production-grade machine learning, multimodal AI systems, and deep-tech automation for real-world challenges.
WORK EXPERIENCE:
1. AI/ML Intern Trainee — NIELIT (Jan 2026 - Jul 2026)
  - AI foundations, model building, and software engineering practice
2. AI/ML Intern Trainee — IIT Ropar (Jan 2026 - Jul 2026)
  - Industrial AI/ML training in collaboration with NIELIT
  - Applied ML experimentation and deployment workflows
TECHNICAL SKILLS:
Programming Languages:
- Python, C++, JavaScript
Frameworks & Technologies:
- PyTorch, TensorFlow, scikit-learn, OpenCV
- NumPy, Pandas, Matplotlib, Plotly, SciPy, mlflow, CUDA
- FastAPI, Flask, React, Next.js, NodeJS, NestJS, TailwindCSS, Three.js, Vite, Streamlit, Flutter, React Native, HTML5, Jinja, Java
- PostgreSQL, MongoDB, MySQL, SQLite, Supabase, Firebase, Google Cloud, Render, Vercel, OpenStack, NPM
- HuggingFace, Transformers, YOLO, OCR, MediaPipe, Telegram API, IoT, Robotics, Edge AI, Sensor Fusion
PROJECT PORTFOLIO:
1. Healthy AI (Live on Render)
2. SignLang AI (Live on Hugging Face)
3. DeepFake Scanner (Live on Hugging Face)
4. AAGNI Assistant (Telegram Powered)
5. Immutable Doc-Verify
6. NeuroLock AI
7. Machine Learning
8. Datasets
ACHIEVEMENTS & LEADERSHIP:
- Founder of MultiModex AI
- Built 10+ projects, including 5+ AI-first systems
- Active in generative AI, multimodal reasoning, and ethical AI development
ADDITIONAL INFORMATION:
Open to AI/ML internships, deep-tech projects, and research collaborations.
`;

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

interface OpenRouterResponse {
  choices?: Array<{
    message?: {
      content?: string | Array<{ type?: string; text?: string }>;
    };
  }>;
}

// Fallback responses for common queries when AI fails
const fallbackResponses: Record<string, string> = {
  "work style": "I work in a research-driven but execution-focused way, validating models with metrics and shipping robust systems with practical deployment constraints in mind.",
  "experience": "I completed summer training in Python, AI/ML, and cybersecurity at Thapar Polytechnic College, followed by AI/ML internship training at IIT Ropar and NIELIT Ropar focused on applied machine learning, experimentation, and deployment-ready implementations.",
  "skills": "I primarily work with Python, PyTorch, TensorFlow, scikit-learn, OpenCV, NumPy, Pandas, FastAPI, Flask, React, Next.js, and cloud platforms like Supabase, Firebase, and Vercel, along with applied automation and multimodal AI pipelines.",
  "education": "I completed my Diploma in Computer Science Engineering at Thapar Polytechnic College (2023-2026), completed summer training in Python, AI/ML, and cybersecurity, completed AI/ML intern training at IIT & NIELIT Ropar, and am pursuing B.Tech in DSAI at Thapar Institute (2026-2029).",
  "projects": "My key projects include Healthy AI, SignLang AI, DeepFake Scanner, AAGNI Assistant, Immutable Doc-Verify, NeuroLock AI, Machine Learning, and Datasets.",
  "contact": "You can reach me at kansalbhavya27@gmail.com or thebhavyakansal20@gmail.com, connect on LinkedIn (linkedin.com/in/kansal0920), or visit github.com/BhavyaKansal20.",
  "achievements": "I have built 10+ projects including 5+ AI-first systems and I am currently building multimodal infrastructure as the founder of MultiModex AI.",
  "leadership": "As founder of MultiModex AI, I focus on building multimodal reasoning systems that combine vision, language, and decision logic for real-world deployment.",
  "availability": "I am open to AI/ML internships, research collaborations, deep-tech projects, and startup partnerships.",
  "text": "You can reach me through bhavyakansal.dev, LinkedIn (linkedin.com/in/kansal0920), or email (kansalbhavya27@gmail.com).",
  "contact information": "Feel free to reach out via kansalbhavya27@gmail.com or connect with me on LinkedIn at linkedin.com/in/kansal0920.",
};

function getFallbackResponse(query: string): string | null {
  const normalizedQuery = query.toLowerCase().trim();
  
  // Check for exact matches first
  if (fallbackResponses[normalizedQuery]) {
    return fallbackResponses[normalizedQuery];
  }
  
  // Check for partial matches
  for (const [key, value] of Object.entries(fallbackResponses)) {
    if (normalizedQuery.includes(key) || key.includes(normalizedQuery)) {
      return value;
    }
  }
  
  return null;
}

export async function queryAI(query: string): Promise<string> {
  try {
    const env = (import.meta.env || {}) as Record<string, string | undefined>;
    const openRouterApiKey = String(env.VITE_OPENROUTER_API_KEY || "").trim();
    const openRouterModel = String(env.VITE_OPENROUTER_MODEL || "openrouter/auto").trim();

    const prompt = `You are an AI assistant for Bhavya Kansal's portfolio website. You have access to Bhavya's complete professional profile and should provide helpful, accurate responses to visitors' questions. Consider the following detailed information:
${RESUME_CONTEXT}

Question: ${query}
Instructions for providing responses:
1. Voice and Tone:
     - Answer in Bhavya's voice (first person)
   - Be confident but humble
2. Content Guidelines:
   - Provide specific, data-backed information when available
   - Highlight achievements and metrics that support your answer
3. Response Structure:
  - Prefer concise answers, but always finish sentences and include proper punctuation. Do not truncate important details. And DON'T Exceed 2 lines in response.
  - Keep the response as condensed as possible while ensuring clarity and completeness.
  - Start with the most relevant information
5. Always:
   - Stay within the scope of the provided information
   - Maintain consistency with the portfolio website
Remember: You are representing a professional developer's portfolio. Your responses should reflect technical expertise while remaining accessible to all visitors.`;

    // Primary provider: OpenRouter
    if (openRouterApiKey) {
      try {
        const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openRouterApiKey}`,
            "HTTP-Referer": String(env.VITE_SITE_URL || window.location.origin || "http://localhost:8080"),
            "X-Title": "Bhavya Kansal Portfolio",
          },
          body: JSON.stringify({
            model: openRouterModel,
            messages: [
              {
                role: "system",
                content: "You answer questions about Bhavya Kansal's portfolio in first person, concisely, accurately, and professionally.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: 0.3,
          }),
        });

        if (openRouterResponse.ok) {
          const openRouterData: OpenRouterResponse = await openRouterResponse.json();
          const raw = openRouterData.choices?.[0]?.message?.content;
          const text =
            typeof raw === "string"
              ? raw.trim()
              : Array.isArray(raw)
                ? raw.map((p) => p?.text || "").join(" ").trim()
                : "";

          if (text && text.length >= 10) return text;
        } else {
          const openRouterErr = await openRouterResponse.text();
          console.error("OpenRouter request failed", openRouterResponse.status, openRouterErr);
        }
      } catch (error) {
        console.error("OpenRouter error:", error);
      }
    }

    // Fallback provider: Gemini

    function getGeminiKeys(): string[] {
      const keys: string[] = [];
      if (env.VITE_GEMINI_API_KEYS) {
        keys.push(...String(env.VITE_GEMINI_API_KEYS).split(',').map((k: string) => k.trim()).filter(Boolean));
      }
      for (let i = 1; i <= 5; i++) {
        const k = env[`VITE_GEMINI_API_KEY${i}`];
        if (k) keys.push(String(k));
      }
      if (env.VITE_GEMINI_API_KEY) {
        keys.push(String(env.VITE_GEMINI_API_KEY));
      }
      // de-duplicate while preserving order
      return Array.from(new Set(keys));
    }

    // Persistent rotation index: pick a random initial key per user, then rotate
    function consumeStartIndex(n: number): number {
      if (n <= 0) return 0;
      try {
        const stored = localStorage.getItem('gemini_key_index');

        // If we have a stored next-index, use it. Otherwise, pick a random start
        if (stored) {
          let idx = parseInt(stored, 10);
          const start = idx % n;
          idx = (idx + 1) % n;
          localStorage.setItem('gemini_key_index', String(idx));
          return start;
        } else {
          const randomStart = Math.floor(Math.random() * n);
          const next = (randomStart + 1) % n;
          localStorage.setItem('gemini_key_index', String(next));
          return randomStart;
        }
      } catch (e) {
        // Non-browser or localStorage error: use a global fallback with random init
        const g = globalThis as typeof globalThis & { __GEMINI_ROTATION_INDEX?: number };
        if (typeof g.__GEMINI_ROTATION_INDEX !== 'number') {
          const randomStart = Math.floor(Math.random() * n);
          g.__GEMINI_ROTATION_INDEX = (randomStart + 1) % n;
          return randomStart;
        }
        const start = g.__GEMINI_ROTATION_INDEX % n;
        g.__GEMINI_ROTATION_INDEX = (g.__GEMINI_ROTATION_INDEX + 1) % n;
        return start;
      }
    }

    const keys = getGeminiKeys();
    if (!keys || keys.length === 0) {
      const fallback = getFallbackResponse(query);
      if (fallback) return fallback;
      return "AI feature not configured. Add VITE_OPENROUTER_API_KEY (preferred) or Gemini API keys in your environment variables.";
    }

    // Try each configured key in round-robin order. We consume a start index so
    // each call prefers a different primary key and will retry with others.
    const start = consumeStartIndex(keys.length);
    let lastErrorText: string | null = null;
    let data: GeminiResponse | null = null;
    let ok = false;

    for (let attempt = 0; attempt < keys.length; attempt++) {
      const key = keys[(start + attempt) % keys.length];
      try {
        const resp = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + key,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: prompt,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.3,
                topP: 0.6,
                topK: 30,
              },
            }),
          }
        );

        if (!resp.ok) {
          const txt = await resp.text();
          lastErrorText = `status=${resp.status} body=${txt}`;
          // try the next key
          continue;
        }

        data = await resp.json();
        ok = true;
        break;
      } catch (err: unknown) {
        lastErrorText = err instanceof Error ? err.message : String(err);
        // try next key
        continue;
      }
    }

    if (!ok || !data) {
      console.error("All Gemini keys failed", lastErrorText);
      const fallback = getFallbackResponse(query);
      if (fallback) return fallback;
      return `I apologize, but I'm having trouble processing your query at the moment. Please try again or rephrase your question.`;
    }

    

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    // Validate and clean up the response
    if (!text || text.length < 10) {
      console.warn("Empty or very short response from API");
      const fallback = getFallbackResponse(query);
      if (fallback) {
        return fallback;
      }
      return "I'm sorry, but I couldn't generate a meaningful response. Please try rephrasing your question.";
    }

    return text;
  } catch (error) {
    console.error("Error in queryAI:", error);
    
    // Try to get a fallback response
    const fallback = getFallbackResponse(query);
    if (fallback) {
      return fallback;
    }
    
    return "I apologize, but I'm having trouble processing your request. Please try again in a moment.";
  }
}

export function isHardcodedQuery(query: string): boolean {
  const hardcodedKeywords = [
    // Navigation
    "projects",
    "contact",
    "resume",
    "theme",
    "cv",
    "github",
    "linkedin"
  ];

  const lowerQuery = query.toLowerCase().trim();
  
  // Check if query starts with or matches any hardcoded keyword (prefix matching)
  return hardcodedKeywords.some((keyword) =>
    keyword.startsWith(lowerQuery) || lowerQuery.startsWith(keyword)
  );
}
