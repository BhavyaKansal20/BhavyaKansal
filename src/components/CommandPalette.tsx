import { useCallback, useEffect, useRef, useState } from "react";
import { Sparkles, Send, Trash2, X, Download, Github, Linkedin, Briefcase, Mail, User, ArrowRight } from "lucide-react";
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

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

const suggestionPills = [
  "Explain your tech stack",
  "Tell me about RetiNex AI",
  "What projects did you deploy?",
  "What training shaped you?",
  "Get Resume"
];

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const { setTheme, theme } = useTheme();
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize messages if empty
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          sender: "bot",
          text: "Hi! I am **AAGNI.AI**, Bhavya's virtual assistant. Ask me anything about his projects, experience, or tech stack! Let's get started.",
          timestamp: new Date()
        }
      ]);
    }
  }, [messages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiLoading]);

  // Keyboard shortcut Ctrl+K / Cmd+K to toggle chat
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Listen to mobile FAB click trigger
  useEffect(() => {
    const openHandler = () => setOpen((prev) => !prev);
    window.addEventListener("open-command-palette", openHandler as EventListener);
    return () => window.removeEventListener("open-command-palette", openHandler as EventListener);
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(36).substring(7),
      sender: "user",
      text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setAiLoading(true);

    try {
      // 1. Build conversational history context for RAG
      const historyContext = messages
        .slice(-6) // Keep last 6 messages to prevent context explosion
        .map(m => `${m.sender === "user" ? "User" : "AAGNI"}: ${m.text}`)
        .join("\n");
      
      const compoundQuery = `[Conversation History]\n${historyContext}\n\n[Current User Question]\n${text}`;

      // 2. Fetch AI response
      const queryAI = await loadQueryAI();
      const response = await queryAI(compoundQuery);

      const botMsg: Message = {
        id: Math.random().toString(36).substring(7),
        sender: "bot",
        text: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: Math.random().toString(36).substring(7),
        sender: "bot",
        text: "Sorry, I am having trouble connecting to my cognitive pipeline. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion === "Get Resume") {
      // Special action for resume
      window.open('/Bhavya-Kansal-Resume.pdf', '_blank');
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          sender: "user",
          text: "Can I view your resume?",
          timestamp: new Date()
        },
        {
          id: Math.random().toString(36).substring(7),
          sender: "bot",
          text: "Sure! I've opened Bhavya's resume in a new tab. You can also [download it directly](/Bhavya-Kansal-Resume.pdf) if needed.",
          timestamp: new Date()
        }
      ]);
    } else {
      handleSendMessage(suggestion);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome-" + Date.now(),
        sender: "bot",
        text: "Conversation reset. Hi! I am **AAGNI.AI**, Bhavya's virtual assistant. Ask me anything about his projects, experience, or tech stack!",
        timestamp: new Date()
      }
    ]);
  };

  // Basic custom markdown formatter to render bold, bullet points, and links as HTML elements
  const formatMessageText = (text: string) => {
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert bullet points
    formatted = formatted.replace(/^\s*[-*]\s+(.*?)$/gm, '• $1');

    // Parse Markdown Links: [text](url) -> <a href="url" target="_blank">text</a>
    const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    formatted = formatted.replace(markdownLinkRegex, '<a href="$2" target="_blank" class="text-blue-400 underline hover:text-blue-300">$1</a>');

    return formatted;
  };

  if (!open) return null;

  return (
    <div 
      className="fixed bottom-4 right-4 md:bottom-24 md:right-8 z-50 w-[92vw] sm:w-[400px] h-[82vh] max-h-[640px] flex flex-col overflow-hidden bg-[#0d0d11]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl transition-all duration-300"
      style={{
        animation: 'chatPanelAppear 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), 0 0 40px rgba(139, 92, 246, 0.15)'
      }}
      ref={chatContainerRef}
    >
      {/* Header */}
      <div className="bg-white/5 border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-blue-600 flex items-center justify-center border border-white/20">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[#0d0d11] animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide">AAGNI.AI</h4>
            <span className="text-[10px] text-gray-400 flex items-center gap-1">
              Online • AI Assistant
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleClearChat}
            className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            title="Clear conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            title="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div 
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.sender === "user"
                  ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-br-none"
                  : "bg-white/5 border border-white/10 text-gray-200 rounded-bl-none"
              }`}
            >
              <div 
                className="leading-relaxed whitespace-pre-wrap break-words format-chat-text"
                dangerouslySetInnerHTML={{ __html: formatMessageText(msg.text) }}
              />
              <span className="text-[9px] text-gray-400/75 block text-right mt-1">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {aiLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-none px-4 py-3 text-sm text-gray-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions Slider */}
      <div className="flex gap-2 overflow-x-auto px-4 py-2 border-t border-white/5 bg-black/30 scrollbar-none select-none">
        {suggestionPills.map((pill) => (
          <button
            key={pill}
            onClick={() => handleSuggestionClick(pill)}
            className="flex-shrink-0 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full px-3 py-1.5 text-xs text-gray-300 hover:text-white transition-all"
          >
            {pill}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputValue);
        }}
        className="p-3 border-t border-white/10 bg-white/5 flex gap-2 items-center"
      >
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask AAGNI about Bhavya..." 
          className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder-gray-500"
          disabled={aiLoading}
        />
        <button 
          type="submit" 
          disabled={!inputValue.trim() || aiLoading}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white flex items-center justify-center transition-all disabled:opacity-40"
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </form>

      <style>{`
        @keyframes chatPanelAppear {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .format-chat-text strong {
          font-weight: 600;
          color: #fff;
        }

        .format-chat-text em {
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default CommandPalette;
