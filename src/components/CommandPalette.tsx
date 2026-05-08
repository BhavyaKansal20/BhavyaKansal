import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import MobileCommandDialog from "@/components/MobileCommandDialog";
import { Briefcase, User, Mail, FileText, Github, Linkedin, Download, Moon, Sun, Sparkles, Loader } from "lucide-react";
import { useTheme } from "next-themes";
import { isHardcodedQuery } from "@/lib/aiSearch";

// lazy wrapper for queryAI to avoid loading AI-related code on page load
let _queryAILib: typeof import("@/lib/aiSearch") | null = null;
const loadQueryAI = async () => {
  if (!_queryAILib) {
    _queryAILib = await import("@/lib/aiSearch");
  }
  return _queryAILib.queryAI;
};

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  category: "project" | "section" | "action" | "ai";
  icon: React.ReactNode;
  action?: () => void;
  content?: string;
}

const aiSuggestions = [
  "Give me your old to latest timeline",
  "What are you doing currently in AI",
  "What have you built and what comes next",
  "Explain your tech stack like a system map",
  "Which live projects are production deployed",
  "What internships and training shaped you",
  "Give me A to Z profile summary"
];

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const { setTheme, theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState(0);

  const projectsData = useMemo(() => [
    {
      id: "healthy-ai",
      title: "Healthy AI",
      description: "Live health intelligence platform with heart, diabetes, and brain MRI modules",
      category: "project" as const,
      icon: <Briefcase className="mr-2 h-4 w-4" />,
      action: () => window.open("https://github.com/BhavyaKansal20/healthy-ai.git", "_blank")
    },
    {
      id: "signlang-ai",
      title: "SignLang AI",
      description: "Real-time sign language to text and speech translation",
      category: "project" as const,
      icon: <Briefcase className="mr-2 h-4 w-4" />,
      action: () => window.open("https://github.com/BhavyaKansal20/SignLang-AI.git", "_blank")
    },
    {
      id: "deepfake-scanner",
      title: "DeepFake Scanner",
      description: "Real-time deepfake screening system with confidence-led classification",
      category: "project" as const,
      icon: <Briefcase className="mr-2 h-4 w-4" />,
      action: () => window.open("https://github.com/BhavyaKansal20/DeepFake-Detector.git", "_blank")
    },
    {
      id: "ml-house-price-prediction",
      title: "ML House Price Prediction",
      description: "Streamlit regression app for house price prediction with tree models",
      category: "project" as const,
      icon: <Briefcase className="mr-2 h-4 w-4" />,
      action: () => window.open("https://github.com/BhavyaKansal20/ML_HousePricePrediction.git", "_blank")
    },
    {
      id: "machine-learning",
      title: "Machine Learning",
      description: "Hands-on machine learning lab with curated notebooks and experiments",
      category: "project" as const,
      icon: <Briefcase className="mr-2 h-4 w-4" />,
      action: () => window.open("https://github.com/BhavyaKansal20/MachineLearning.git", "_blank")
    },
    {
      id: "deep-learning",
      title: "Deep Learning",
      description: "Structured deep learning notebooks across ANN, CNN, RNN, and optimization",
      category: "project" as const,
      icon: <Briefcase className="mr-2 h-4 w-4" />,
      action: () => window.open("https://github.com/BhavyaKansal20/DeepLearning.git", "_blank")
    },
    {
      id: "datasets",
      title: "Datasets",
      description: "Curated dataset repository for AI and ML training workflows",
      category: "project" as const,
      icon: <Briefcase className="mr-2 h-4 w-4" />,
      action: () => window.open("https://github.com/BhavyaKansal20/Datasets.git", "_blank")
    },
    {
      id: "aagni",
      title: "AAGNI Assistant",
      description: "Telegram-based NLP assistant for conversational automation workflows",
      category: "project" as const,
      icon: <Briefcase className="mr-2 h-4 w-4" />,
      action: () => window.open("https://github.com/BhavyaKansal20/Telegram-Chatbot-", "_blank")
    },
    {
      id: "certificate-verifier",
      title: "Immutable Doc-Verify",
      description: "OCR and cryptography-based certificate verification workflow",
      category: "project" as const,
      icon: <Briefcase className="mr-2 h-4 w-4" />,
      action: () => window.open("https://github.com/BhavyaKansal20/Certificate-Verifier", "_blank")
    },
    {
      id: "neurolock",
      title: "NeuroLock AI",
      description: "Real-time facial analytics and session reporting platform",
      category: "project" as const,
      icon: <Briefcase className="mr-2 h-4 w-4" />,
      action: () => window.open("https://github.com/BhavyaKansal20/neurolock-ai-", "_blank")
    },
  ], []);

  const handleAISearch = async (query: string) => {
    if (!query.trim() || isHardcodedQuery(query)) {
      setAiResponse(null);
      return;
    }

    setAiLoading(true);
    try {
      const queryAI = await loadQueryAI();
      const response = await queryAI(query);
      setAiResponse(response);
    } catch (error) {
      setAiResponse("Unable to process query.");
    } finally {
      setAiLoading(false);
    }
  };

  const fuzzySearch = useCallback((query: string): SearchResult[] => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    
    // Secret command to check AI provider status
    if (lowerQuery === "!status ai" || lowerQuery === "!ai" || lowerQuery === "!status gemini" || lowerQuery === "!gemini") {
      const checkAPI = async () => {
        try {
          const queryAI = await loadQueryAI();
          await queryAI("test");
          setAiResponse("✅ AI provider is working correctly!");
        } catch (error) {
          setAiResponse("❌ AI provider is not responding. Please check your environment configuration.");
        }
      };
      checkAPI();
      return [];
    }

    const results = projectsData.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(lowerQuery);
      const descMatch = item.description?.toLowerCase().includes(lowerQuery);
      return titleMatch || descMatch;
    }).sort((a, b) => {
      const aTitle = a.title.toLowerCase().includes(lowerQuery);
      const bTitle = b.title.toLowerCase().includes(lowerQuery);
      return aTitle === bTitle ? 0 : aTitle ? -1 : 1;
    });

    return results;
  }, [projectsData]);

  useEffect(() => {
    // Rotate AI suggestions every 3 seconds
    const rotationInterval = setInterval(() => {
      setCurrentSuggestion((prev) => (prev + 1) % aiSuggestions.length);
    }, 3000);

    return () => clearInterval(rotationInterval);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    const openHandler = () => setOpen(true);
    window.addEventListener("open-command-palette", openHandler as EventListener);
    return () => window.removeEventListener("open-command-palette", openHandler as EventListener);
  }, []);

  // return focus to FAB on mobile when dialog closes
  useEffect(() => {
    if (!open && isMobile) {
      const fab = document.getElementById('mobile-fab') as HTMLButtonElement | null;
      fab?.focus();
    }
  }, [open, isMobile]);

  useEffect(() => {
    // Immediate fuzzy search (no debounce - instant results)
    if (searchQuery.trim()) {
      const results = fuzzySearch(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
      setAiResponse(null);
      return;
    }

    // Debounced AI search (300ms delay - reduces API calls)
    const delay = isMobile ? 2000 : 1500;
    const timer = setTimeout(() => {
      handleAISearch(searchQuery);
    }, delay);

    // Cleanup: cancel previous timer if user types again
    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery, isMobile, fuzzySearch]);

  const handleNavigation = (href: string) => {
    setOpen(false);
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = href;
    }
  };

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
    };
  }, []);

  const commandContent = (
    <>
      <CommandInput 
        placeholder={isMobile ? "Search portfolio or commands" : "Search portfolio, ask questions, or use commands... (AI-powered)"} 
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList className={isMobile ? "max-h-none flex-1 overflow-y-auto" : undefined}>
        {!aiResponse && !aiLoading && <CommandEmpty>
          {searchQuery ? "Searching..." : "Start typing to search or ask anything..."}
        </CommandEmpty>}

        {/* AI Response Section - Shown Immediately */}
        {searchQuery && !isHardcodedQuery(searchQuery) && (
          <>
            {aiLoading && (
              <>
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
                <CommandSeparator />
              </>
            )}
            {aiResponse && aiResponse.trim() && (
              <>
                <div className="px-4 py-3">
                  <div className="text-xs font-semibold text-muted-foreground mb-2">🤖 AI ASSISTANT</div>
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-500" />
                        <p className="text-sm text-foreground leading-relaxed flex-1 whitespace-pre-wrap break-words">{aiResponse}</p>
                        {/* aria-live region for screen readers on mobile */}
                        {isMobile && (
                          <div className="sr-only" aria-live="polite">AI response: {aiResponse}</div>
                        )}
                  </div>
                </div>
                <CommandSeparator />
              </>
            )}
          </>
        )}

        {/* Fuzzy Search Results */}
        {searchResults.length > 0 && (
          <>
            <CommandGroup heading="Projects">
              {searchResults.map((result) => (
                <CommandItem
                  key={result.id}
                  onSelect={() => {
                    result.action?.();
                    setOpen(false);
                  }}
                >
                  {result.icon}
                  <div className="flex-1">
                    <div className="font-medium">{result.title}</div>
                    <div className="text-xs text-muted-foreground">{result.description}</div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        <CommandGroup heading="Suggestions">
          <CommandItem 
            onSelect={() => setSearchQuery(aiSuggestions[currentSuggestion])}
            className="group"
          >
            <Sparkles className="mr-2 h-4 w-4 text-foreground transition-colors" />
            <div className="suggestion-flip-container overflow-hidden">
              <span 
                key={currentSuggestion}
                className="text-foreground transition-colors inline-block animate-flip-text"
              >
                {aiSuggestions[currentSuggestion]}...
              </span>
            </div>
          </CommandItem>

          <style>{`
            @keyframes flipIn {
              0% {
                transform: rotateX(90deg);
                opacity: 0;
              }
              100% {
                transform: rotateX(0deg);
                opacity: 1;
              }
            }

            .animate-flip-text {
              animation: flipIn 0.6s ease-out;
              transform-origin: top;
            }

            .suggestion-flip-container {
              line-height: 1.2;
              min-height: 1.2em;
            }
          `}</style>

          <CommandItem onSelect={() => {
            setTheme(theme === "dark" ? "light" : "dark");
            setOpen(false);
          }}>
            {theme === "dark" ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            <span>Toggle Theme</span>
          </CommandItem>

          <CommandItem onSelect={() => handleNavigation("#projects")}>
            <Briefcase className="mr-2 h-4 w-4" />
            <span>View Projects</span>
          </CommandItem>
          
          <CommandItem onSelect={() => handleNavigation("#contact")}>
            <Mail className="mr-2 h-4 w-4" />
            <span>Contact Me</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => {
            window.open('/Bhavya-Kansal-Resume.pdf', '_blank');
            setOpen(false);
          }}>
            <Download className="mr-2 h-4 w-4" />
            <span>View Resume</span>
          </CommandItem>
          <CommandItem onSelect={() => {
            window.open("https://github.com/BhavyaKansal20", "_blank");
            setOpen(false);
          }}>
            <Github className="mr-2 h-4 w-4" />
            <span>View GitHub</span>
          </CommandItem>
          <CommandItem onSelect={() => {
            window.open("https://linkedin.com/in/kansal0920", "_blank");
            setOpen(false);
          }}>
            <Linkedin className="mr-2 h-4 w-4" />
            <span>View LinkedIn</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </>
  );

  return (
    <>
      {isMobile ? (
        <MobileCommandDialog open={open} onOpenChange={setOpen} searchValue={searchQuery} onClear={() => setSearchQuery("")}>
          {commandContent}
        </MobileCommandDialog>
      ) : (
        <CommandDialog open={open} onOpenChange={setOpen} searchValue={searchQuery} onClear={() => setSearchQuery("")}>
          {commandContent}
        </CommandDialog>
      )}
    </>
  );
};

export default CommandPalette;
