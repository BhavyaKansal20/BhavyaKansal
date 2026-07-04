import { projectsData, type Project } from "../data/projects";

// Dynamically rank projects by quality signals
function rankProjects(projects: Project[]): Project[] {
  return [...projects]
    .map((p) => {
      let score = 0;
      if (p.liveUrl) score += 3;
      if (p.featured) score += 2;
      score += Math.min(p.metrics?.length || 0, 4);
      score += Math.min(p.features?.length || 0, 5) * 0.5;
      score += Math.min(p.techStack?.length || 0, 6) * 0.3;
      // Boost for high accuracy metrics
      for (const m of p.metrics || []) {
        const num = parseFloat(m.value);
        if (!isNaN(num) && num > 80) score += 1;
      }
      return { project: p, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((e) => e.project);
}

function buildDynamicProjectContext(): string {
  const ranked = rankProjects(projectsData);
  return ranked
    .map((p, i) => {
      const live = p.liveUrl ? ` | LIVE: ${p.liveUrl}` : "";
      const metrics = (p.metrics || [])
        .map((m) => `${m.label}: ${m.value}`)
        .join(", ");
      return `${i + 1}. ${p.title} — ${p.description} [${p.tags.join(", ")}]${live}${metrics ? ` | Metrics: ${metrics}` : ""}`;
    })
    .join("\n");
}

// Resume context for AI assistant
const RESUME_CONTEXT = `PERSONAL INFORMATION & CONTACT:
Name: Bhavya Kansal
Role: AI/ML Engineer and Applied Research Builder
Education: Diploma in CSE at Thapar Polytechnic College (2023-2026), Summer Training in Python/AI-ML/Cybersecurity (Jun-Aug 2025), AI/ML Intern Trainee at IIT & NIELIT Ropar (Jan-Jul 2026), B.Tech in Data Science & Artificial Intelligence at TIET — Thapar Institute of Engineering & Technology, Patiala (2026-2029)
Primary Email: kansalbhavya27@gmail.com
Secondary Email: kansalbhavya20@icloud.com
LinkedIn: linkedin.com/in/bhavyakansal20
GitHub: github.com/BhavyaKansal20
Google Developer: g.dev/kansalbhavya20
Portfolio: bhavyakansal.dev
Location: Patiala, Punjab, India
PROFESSIONAL SUMMARY:
AI/ML engineer focused on production-grade machine learning, multimodal AI systems, computer vision, and deep-tech automation. Bridging research and deployment to solve real-world engineering challenges. Currently pursuing B.Tech DS&AI at TIET — one of India's premier technical institutions.
WORK EXPERIENCE:
1. AI/ML Intern Trainee — IIT & NIELIT Ropar (Jan 2026 - Jul 2026)
   - Industrial AI/ML training focused on applied machine learning workflows, model experimentation, computer vision pipelines, and real-world deployment
   - Collaborated with research teams on deep learning projects
2. AI/ML & Cybersecurity Trainee — Thapar Polytechnic College (Jun 2025 - Aug 2025)
   - Intensive summer training in Python, AI/ML, and cybersecurity through practical labs and mini-project implementation
TECHNICAL SKILLS:
Programming Languages: Python, C++, JavaScript, TypeScript
Frameworks & Technologies:
- AI/ML: PyTorch, TensorFlow, scikit-learn, OpenCV, Keras, NumPy, Pandas, Matplotlib, SciPy, CUDA, mlflow, LangChain
- Web/Backend: FastAPI, Flask, React, Next.js, NodeJS, NestJS, TailwindCSS, Three.js, Vite, Streamlit, Flutter, HTML5, Jinja
- Databases/Cloud: PostgreSQL, MongoDB, MySQL, SQLite, Firebase, Google Cloud, Render, Vercel, Supabase
- Tools: HuggingFace Transformers, YOLO, MediaPipe, Gradio, OCR, IoT, Robotics, Raspberry Pi, Edge AI, Git
PROJECT PORTFOLIO:
1. Healthy AI — Medical AI platform (Live on Render)
2. ChromaCrystal UHD — AI image enhancement (Live on Hugging Face Spaces)
3. SignLang AI — Sign language recognition system (Live on Hugging Face Spaces)
4. DeepFake Scanner — Deepfake detection system (Live on Hugging Face Spaces)
5. ML House Price Prediction — Regression ML model (Live on Hugging Face Spaces)
6. RetiNex AI — Diabetic Retinopathy Detection with GradCAM explainability
7. Machine Learning — ML algorithms & experiments repository
8. Deep Learning — DL architectures & research implementations
9. AAGNI Assistant — Intelligent Telegram-powered AI assistant
10. Immutable Doc-Verify — Blockchain document verification
11. NeuroLock AI — AI-powered security system
12. Datasets — Curated ML training datasets
ACHIEVEMENTS:
- Built 12+ production projects including 10+ AI-first systems
- Google Developer Program Member with 10+ badges
- Active in generative AI, multimodal reasoning, medical CV, and ethical AI development
- Trained at IIT Ropar & NIELIT — top-tier industrial AI exposure
AVAILABILITY:
Open to AI/ML internships, deep-tech research collaborations, and selective freelance projects.
Contact: kansalbhavya27@gmail.com or kansalbhavya20@icloud.com
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

type KnowledgeChunk = {
  id: string;
  title: string;
  period: "past" | "current" | "future" | "foundation";
  tags: string[];
  content: string;
};

const PERSONAL_KNOWLEDGE_BASE: KnowledgeChunk[] = [
  {
    id: "identity-core",
    title: "Identity and Core Positioning",
    period: "foundation",
    tags: ["about", "summary", "identity", "profile"],
    content:
      "Bhavya Kansal is an AI/ML engineer focused on production-grade machine learning, multimodal AI systems, and practical deep-tech automation for real-world problems.",
  },
  {
    id: "current-phase",
    title: "Current Focus",
    period: "current",
    tags: ["current", "focus", "now", "research", "work"],
    content:
      "Current focus includes applied AI deployment, multimodal reasoning systems, ethical AI, and practical product-grade engineering while pursuing B.Tech in DSAI at TIET (2026-2029).",
  },
  {
    id: "past-education-timeline",
    title: "Past Timeline",
    period: "past",
    tags: ["past", "timeline", "education", "internship", "experience"],
    content:
      "Completed Diploma in CSE at Thapar Polytechnic College (2023-2026). Completed summer training in Python, AI/ML, and cybersecurity (Jun-Aug 2025). Completed AI/ML intern training at IIT Ropar and NIELIT Ropar (Jan-Jul 2026).",
  },
  {
    id: "future-direction",
    title: "Future Direction",
    period: "future",
    tags: ["future", "roadmap", "goals", "plans", "next"],
    content:
      "Future direction is to scale multimodal AI products, strengthen research-to-production execution, and collaborate on deep-tech systems in AI infrastructure, automation, and practical deployment pipelines.",
  },
  {
    id: "stack-ai-ml",
    title: "AI and ML Stack",
    period: "foundation",
    tags: ["skills", "tech", "stack", "ai", "ml", "frameworks"],
    content:
      "Core AI/ML stack includes Python, PyTorch, TensorFlow, scikit-learn, OpenCV, NumPy, Pandas, Matplotlib, Plotly, SciPy, MLflow, CUDA, HuggingFace Transformers, YOLO, OCR, MediaPipe, and edge AI workflows.",
  },
  {
    id: "stack-web-cloud",
    title: "Web and Cloud Stack",
    period: "foundation",
    tags: ["backend", "frontend", "cloud", "deployment", "engineering"],
    content:
      "Engineering stack includes FastAPI, Flask, React, Next.js, Node.js, NestJS, TailwindCSS, Three.js, Vite, Streamlit, PostgreSQL, MongoDB, MySQL, SQLite, Supabase, Firebase, Google Cloud, Render, and Vercel.",
  },
  {
    id: "projects-signature",
    title: "Signature Projects",
    period: "foundation",
    tags: ["projects", "portfolio", "build", "systems", "best", "top"],
    content: `Bhavya's projects ranked by quality and impact:\n${buildDynamicProjectContext()}`,
  },
  {
    id: "leadership-impact",
    title: "Leadership and Impact",
    period: "current",
    tags: ["leadership", "impact", "engineering", "achievements"],
    content:
      "Built 12+ projects including 7+ AI-first systems. Open to AI/ML internships, research collaborations, and deep-tech engineering projects.",
  },
];

type GithubRepoSnapshot = {
  name: string;
  description: string;
  language: string;
  stars: number;
  updatedAt: string;
  url: string;
  homepage: string;
};

type GithubCache = {
  timestamp: number;
  profileSummary: string;
};

const GITHUB_CACHE_KEY = "portfolio_github_snapshot_v1";
const GITHUB_CACHE_TTL_MS = 12 * 60 * 60 * 1000;

function safeDateLabel(iso: string): string {
  if (!iso) return "recently";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "recently";
  return d.toISOString().slice(0, 10);
}

function parseRepoSnapshot(data: unknown): GithubRepoSnapshot[] {
  if (!Array.isArray(data)) return [];
  return data
    .filter((item) => item && typeof item === "object")
    .slice(0, 8)
    .map((repo) => {
      const r = repo as Record<string, unknown>;
      return {
        name: String(r.name || ""),
        description: String(r.description || "No description"),
        language: String(r.language || "Mixed"),
        stars: Number(r.stargazers_count || 0),
        updatedAt: String(r.pushed_at || r.updated_at || ""),
        url: String(r.html_url || ""),
        homepage: String(r.homepage || ""),
      };
    })
    .filter((repo) => repo.name && repo.url);
}

async function fetchLiveGithubSnapshot(): Promise<string> {
  if (typeof window === "undefined") return "";

  try {
    const cachedRaw = localStorage.getItem(GITHUB_CACHE_KEY);
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw) as GithubCache;
      if (Date.now() - cached.timestamp < GITHUB_CACHE_TTL_MS && cached.profileSummary) {
        return cached.profileSummary;
      }
    }
  } catch (error) {
    console.warn("GitHub snapshot cache read failed", error);
  }

  try {
    const response = await fetch("https://api.github.com/users/BhavyaKansal20/repos?per_page=20&sort=updated");
    if (!response.ok) return "";

    const raw = await response.json();
    const repos = parseRepoSnapshot(raw);
    if (repos.length === 0) return "";

    const summary = repos
      .map((repo, idx) => {
        const live = repo.homepage ? ` | Live: ${repo.homepage}` : "";
        return `${idx + 1}. ${repo.name} (${repo.language}, ${repo.stars} stars, updated ${safeDateLabel(repo.updatedAt)}) - ${repo.description}${live}`;
      })
      .join("\n");

    const payload: GithubCache = {
      timestamp: Date.now(),
      profileSummary: summary,
    };

    localStorage.setItem(GITHUB_CACHE_KEY, JSON.stringify(payload));
    return summary;
  } catch (error) {
    console.warn("Unable to fetch live GitHub snapshot", error);
    return "";
  }
}

const PERIOD_BOOST: Record<KnowledgeChunk["period"], number> = {
  past: 0,
  current: 0,
  future: 0,
  foundation: 0,
};

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1);
}

function inferPeriodBoost(query: string): Record<KnowledgeChunk["period"], number> {
  const q = query.toLowerCase();
  const boost = { ...PERIOD_BOOST };

  if (/\b(old|previous|past|before|history|earlier|pehle|purani?)\b/.test(q)) boost.past += 2;
  if (/\b(current|now|present|ongoing|abhi|taji|latest|recent|new)\b/.test(q)) boost.current += 2;
  if (/\b(future|next|roadmap|plan|goal|karunga|will do)\b/.test(q)) boost.future += 2;
  if (/\b(a\s*to\s*z|complete|all|everything|110|full profile)\b/.test(q)) {
    boost.foundation += 1;
    boost.current += 1;
    boost.past += 1;
    boost.future += 1;
  }

  return boost;
}

function retrieveKnowledge(query: string, limit = 6): KnowledgeChunk[] {
  const terms = tokenize(query);
  const periodBoost = inferPeriodBoost(query);

  const ranked = PERSONAL_KNOWLEDGE_BASE.map((chunk) => {
    const haystack = `${chunk.title} ${chunk.content} ${chunk.tags.join(" ")}`.toLowerCase();
    let score = periodBoost[chunk.period];

    for (const term of terms) {
      if (haystack.includes(term)) score += 1;
      if (chunk.tags.some((tag) => tag.includes(term))) score += 1;
    }

    return { chunk, score };
  })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.chunk);

  return ranked.length > 0 ? ranked : PERSONAL_KNOWLEDGE_BASE.slice(0, limit);
}

function buildRagContext(query: string): string {
  return retrieveKnowledge(query)
    .map((chunk, index) => `${index + 1}. [${chunk.period.toUpperCase()}] ${chunk.title}: ${chunk.content}`)
    .join("\n");
}

// Fallback responses for common queries when AI fails
const fallbackResponses: Record<string, string> = {
  "work style": "I work in a research-driven but execution-focused way, validating models with metrics and shipping robust systems with practical deployment constraints in mind.",
  "experience": "I completed summer training in Python, AI/ML, and cybersecurity at Thapar Polytechnic College, followed by AI/ML internship training at IIT Ropar and NIELIT Ropar focused on applied machine learning, experimentation, and deployment-ready implementations.",
  "skills": "I primarily work with Python, PyTorch, TensorFlow, scikit-learn, OpenCV, NumPy, Pandas, FastAPI, Flask, React, Next.js, and cloud platforms like Supabase, Firebase, and Vercel, along with applied automation and multimodal AI pipelines.",
  "education": "I completed my Diploma in Computer Science Engineering at Thapar Polytechnic College (2023-2026), completed summer training in Python, AI/ML, and cybersecurity, completed AI/ML intern training at IIT & NIELIT Ropar, and am pursuing B.Tech in DSAI at Thapar Institute (2026-2029).",
  "projects": "My key projects include Healthy AI, ChromaCrystal UHD, SignLang AI, DeepFake Scanner, ML House Price Prediction, RetiNex AI, Machine Learning, Deep Learning, Datasets, AAGNI Assistant, Immutable Doc-Verify, and NeuroLock AI.",
  "contact": "You can reach me at kansalbhavya27@gmail.com or kansalbhavya20@icloud.com, connect on LinkedIn (linkedin.com/in/bhavyakansal20), or visit github.com/BhavyaKansal20.",
  "achievements": "I have built 12+ projects including 7+ AI-first systems with practical deployment experience across healthcare AI, accessibility, computer vision, and automation.",
  "leadership": "I focus on leading projects end-to-end, from model prototyping to production-ready implementation and deployment.",
  "availability": "I am open to AI/ML internships, research collaborations, deep-tech projects, and startup partnerships.",
  "text": "You can reach Bhavya through bhavyakansal.dev, LinkedIn (linkedin.com/in/bhavyakansal20), or email (kansalbhavya27@gmail.com).",
  "contact information": "Feel free to reach out via kansalbhavya27@gmail.com or connect on LinkedIn at linkedin.com/in/bhavyakansal20.",
};

const fallbackPatterns: Array<{ test: RegExp; value: string }> = [
  {
    test: /\b(skill|skills|tech stack|technolog|framework|tools)\b/i,
    value:
      "I work primarily with Python, PyTorch, TensorFlow, scikit-learn, OpenCV, NumPy, Pandas, FastAPI, Flask, React, Next.js, and cloud platforms like Supabase, Firebase, and Vercel.",
  },
  {
    test: /\b(project|projects|built|build)\b/i,
    value:
      "My key projects include Healthy AI, ChromaCrystal UHD, SignLang AI, DeepFake Scanner, ML House Price Prediction, RetiNex AI, Machine Learning, Deep Learning, Datasets, AAGNI Assistant, Immutable Doc-Verify, and NeuroLock AI.",
  },
  {
    test: /\b(education|study|college|diploma|btech|degree)\b/i,
    value:
      "I’m currently pursuing B.Tech in DSAI at Thapar Institute of Engineering & Technology, after completing Diploma in CSE at Thapar Polytechnic College.",
  },
  {
    test: /\b(contact|reach|email|linkedin|github)\b/i,
    value:
      "You can reach Bhavya at [kansalbhavya27@gmail.com](mailto:kansalbhavya27@gmail.com), connect on [LinkedIn](https://linkedin.com/in/bhavyakansal20), or visit [GitHub](https://github.com/BhavyaKansal20).",
  },
  {
    test: /\b(experience|intern|work|role|background)\b/i,
    value:
      "I have experience across AI/ML internship training at IIT Ropar and NIELIT, plus hands-on work on production-style AI projects and applied automation.",
  },
];

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

  for (const pattern of fallbackPatterns) {
    if (pattern.test.test(query)) {
      return pattern.value;
    }
  }
  
  return null;
}

export async function queryAI(query: string): Promise<string> {
  try {
    const env = (import.meta.env || {}) as Record<string, string | undefined>;
    const openRouterApiKey = String(env.VITE_OPENROUTER_API_KEY || "").trim();
    const openRouterModel = String(env.VITE_OPENROUTER_MODEL || "openrouter/auto").trim();
    const ragContext = buildRagContext(query);
    const liveGithubContext = await fetchLiveGithubSnapshot();

    const prompt = `You are AAGNI AI, the intelligent virtual assistant for Bhavya Kansal's portfolio website. You work for Bhavya as his co-pilot and should provide helpful, accurate responses to visitors' questions. Consider the following detailed information about Bhavya:
${RESUME_CONTEXT}

Retrieved RAG context for this question:
${ragContext}

Live GitHub updates (auto-refreshed from profile API):
${liveGithubContext || "No fresh GitHub snapshot available. Use curated profile context above."}

Dynamic Project Rankings (auto-generated from portfolio data, sorted best-first):
${buildDynamicProjectContext()}

Question: ${query}

You are a highly capable, intelligent assistant. Answer well:

1. Intelligence & scope:
   - You can reason about complex, technical, and open-ended questions. If a visitor asks a general or technical question (e.g. "explain transformers", "compare PyTorch vs TensorFlow", "review this idea"), answer it genuinely and accurately, then connect it back to Bhavya's relevant experience or projects when natural.
   - When asked about Bhavya, prefer the retrieved RAG context and concrete metrics over generic claims.
   - If asked about old/current/future work, answer in timeline order.
  - If the question is ambiguous, infer the most useful portfolio intent and answer with a short clarifying note plus the best direct action.

2. Voice & tone:
   - Refer to Bhavya in the third person ("Bhavya built...", "Bhavya specializes in...").
   - Professional, warm, confident. Highlight real achievements and metrics.

3. Formatting (rendered as rich text):
   - Use **bold** for key terms, short bullet lists for multiple items, and clickable markdown links like [GitHub](https://github.com/BhavyaKansal20) whenever you mention a profile, project, resume, or email.
   - Be thorough but not padded: usually 2–6 sentences, or a tight bullet list. Never truncate mid-thought. It is fine to give a longer, well-structured answer for complex questions.
  - When useful, include direct links to Bhavya's live site sections or profiles so the user can act immediately.

4. Agentic actions (optional, powerful):
   - You can trigger real actions on the site. If (and only if) it clearly helps the visitor, append ONE action block at the very end, exactly like:
     <<ACTIONS>> verb, verb <<ACTIONS>>
   - Available verbs: goto:projects | goto:about | goto:timeline | goto:coding | goto:faq | goto:contact | open_resume | github | linkedin | leetcode | google | email | email:secondary | theme:dark | theme:light | open:<full-https-url>
   - Examples: visitor asks to see projects → end with "<<ACTIONS>> goto:projects <<ACTIONS>>". Visitor asks for the resume → "<<ACTIONS>> open_resume <<ACTIONS>>". Only use actions when the visitor's intent maps to one; otherwise omit the block entirely.
   - Keep the visible answer natural — do not mention the action block itself.

Answer the question now.`;

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
                content: "You are AAGNI AI, Bhavya Kansal's intelligent virtual assistant. Answer questions about Bhavya's projects, experience, and skills in the third person, concisely, accurately, and professionally.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: 0.4,
            max_tokens: 900,
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
                temperature: 0.4,
                topP: 0.7,
                topK: 40,
                maxOutputTokens: 1024,
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
  const hardcodedQueries = new Set([
    "projects",
    "contact",
    "resume",
    "theme",
    "cv",
    "github",
    "linkedin",
    "about",
  ]);

  const lowerQuery = query.toLowerCase().trim();

  // Only short command-style queries should be blocked from AI lookup.
  return hardcodedQueries.has(lowerQuery);
}
