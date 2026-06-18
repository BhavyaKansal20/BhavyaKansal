import { useCallback, useEffect, useRef, useState } from "react";
import { 
  Send, 
  Trash2, 
  X, 
  Mic, 
  Paperclip, 
  Smile, 
  Check, 
  CheckCheck, 
  Mail, 
  Github, 
  Linkedin, 
  ExternalLink,
  FileText,
  Sparkles
} from "lucide-react";
import { useTheme } from "next-themes";

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
  sender: "user" | "bot" | "system";
  text: string;
  timestamp: Date;
  status?: "sending" | "sent" | "read";
}

const suggestionPills = [
  "Explain tech stack",
  "Tell me about RetiNex AI",
  "Connect with Bhavya",
  "Get Resume"
];

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showEmojiAlert, setShowEmojiAlert] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const attachMenuRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          sender: "bot",
          text: "Hi! I am **AAGNI AI**, Bhavya's custom AI Co-pilot. Ask me anything about his projects, experience, or skills! You can also click the paperclip icon to grab his resume or contact details.",
          timestamp: new Date()
        }
      ]);
    }
  }, [messages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiLoading]);

  // Click outside to close attachment menu
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (showAttachMenu && attachMenuRef.current && !attachMenuRef.current.contains(e.target as Node)) {
        setShowAttachMenu(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showAttachMenu]);

  // Keyboard shortcut Ctrl+K / Cmd+K to toggle chat
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setShowAttachMenu(false);
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

    const messageId = Math.random().toString(36).substring(7);
    const userMsg: Message = {
      id: messageId,
      sender: "user",
      text,
      timestamp: new Date(),
      status: "sending"
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setAiLoading(true);
    setShowAttachMenu(false);

    // Simulate WhatsApp message transition stages
    setTimeout(() => {
      setMessages(prev => 
        prev.map(m => m.id === messageId ? { ...m, status: "sent" } : m)
      );
    }, 450);

    try {
      // Build conversation context
      const historyContext = messages
        .slice(-6)
        .map(m => `${m.sender === "user" ? "User" : "AAGNI"}: ${m.text}`)
        .join("\n");
      
      const compoundQuery = `[Conversation History]\n${historyContext}\n\n[Current User Question]\n${text}`;

      const queryAI = await loadQueryAI();
      const response = await queryAI(compoundQuery);

      // Update user messages to "read" (cyan ticks)
      setMessages(prev => 
        prev.map(m => m.sender === "user" ? { ...m, status: "read" } : m)
      );

      const botMsg: Message = {
        id: Math.random().toString(36).substring(7),
        sender: "bot",
        text: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      setMessages(prev => 
        prev.map(m => m.sender === "user" ? { ...m, status: "sent" } : m)
      );

      const errorMsg: Message = {
        id: Math.random().toString(36).substring(7),
        sender: "bot",
        text: "I am having trouble connecting to my cognitive pipeline. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion === "Connect with Bhavya") {
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          sender: "user",
          text: "How can I connect with Bhavya?",
          timestamp: new Date(),
          status: "read"
        },
        {
          id: Math.random().toString(36).substring(7),
          sender: "bot",
          text: "You can reach out to Bhavya directly via these email addresses:\n\n✉️ **Primary Email:** [kansalbhavya27@gmail.com](mailto:kansalbhavya27@gmail.com)\n✉️ **Alternate Email:** [bhavyakansal20@icloud.com](mailto:bhavyakansal20@icloud.com)\n\nFeel free to write anytime!",
          timestamp: new Date()
        }
      ]);
    } else if (suggestion === "Get Resume") {
      window.open('/Bhavya-Kansal-Resume.pdf', '_blank');
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          sender: "user",
          text: "Can I view your resume?",
          timestamp: new Date(),
          status: "read"
        },
        {
          id: Math.random().toString(36).substring(7),
          sender: "bot",
          text: "Certainly! I've opened Bhavya's resume in a new tab. You can also [download it directly](/Bhavya-Kansal-Resume.pdf) for offline review.",
          timestamp: new Date()
        }
      ]);
    } else {
      handleSendMessage(suggestion);
    }
  };

  const handleShareClick = (type: "email" | "github" | "linkedin" | "resume") => {
    setShowAttachMenu(false);
    if (type === "email") {
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          sender: "bot",
          text: "Here are Bhavya's contact details:\n\n📬 **Primary Email:** [kansalbhavya27@gmail.com](mailto:kansalbhavya27@gmail.com)\n📬 **Alternate Email:** [bhavyakansal20@icloud.com](mailto:bhavyakansal20@icloud.com)\n\nClick either address to write directly!",
          timestamp: new Date()
        }
      ]);
    } else if (type === "github") {
      window.open('https://github.com/BhavyaKansal20', '_blank');
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          sender: "bot",
          text: "Opening Bhavya's [GitHub Profile](https://github.com/BhavyaKansal20) in a new tab. Look at his 12+ featured systems!",
          timestamp: new Date()
        }
      ]);
    } else if (type === "linkedin") {
      window.open('https://linkedin.com/in/kansal0920', '_blank');
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          sender: "bot",
          text: "Opening Bhavya's [LinkedIn Profile](https://linkedin.com/in/kansal0920) in a new tab. Let's connect!",
          timestamp: new Date()
        }
      ]);
    } else if (type === "resume") {
      window.open('/Bhavya-Kansal-Resume.pdf', '_blank');
    }
  };

  const handleMicClick = () => {
    const systemId = Math.random().toString(36).substring(7);
    const systemMsg: Message = {
      id: systemId,
      sender: "system",
      text: "System: Voice note parsing is in beta. Please type your query in the chatbox!",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, systemMsg]);
    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== systemId));
    }, 5000);
  };

  const handleEmojiClick = () => {
    setShowEmojiAlert(true);
    setTimeout(() => setShowEmojiAlert(false), 3000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome-" + Date.now(),
        sender: "bot",
        text: "Conversation reset. Hi! I am **AAGNI AI**, Bhavya's custom AI Co-pilot. Ask me anything!",
        timestamp: new Date()
      }
    ]);
  };

  const formatMessageText = (text: string) => {
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    formatted = formatted.replace(/^\s*[-*]\s+(.*?)$/gm, '• $1');

    const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    formatted = formatted.replace(markdownLinkRegex, '<a href="$2" target="_blank" class="text-cyan-400 font-semibold underline hover:text-cyan-300">$1</a>');

    return formatted;
  };

  const renderTicks = (status?: "sending" | "sent" | "read") => {
    if (status === "sending") {
      return <Check className="w-3.5 h-3.5 text-slate-500" />;
    }
    if (status === "sent") {
      return <CheckCheck className="w-3.5 h-3.5 text-slate-500" />;
    }
    if (status === "read") {
      return <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />;
    }
    return null;
  };

  if (!open) return null;

  return (
    <div 
      className="fixed bottom-4 right-4 md:bottom-24 md:right-8 z-50 w-[92vw] sm:w-[430px] h-[82vh] max-h-[660px] rounded-2xl shadow-2xl transition-all duration-300 border border-white/10"
      style={{
        animation: 'chatPanelAppear 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
      ref={chatContainerRef}
    >

      {/* Solid inner cover (Premium Dark Mode) */}
      <div 
        className="relative w-full h-full rounded-2xl flex flex-col overflow-hidden z-10"
        style={{ backgroundColor: '#0d1117' }}
      >
        
        {/* Header - Premium Dark */}
        <div className="px-4 py-3 flex items-center justify-between z-10 border-b border-white/5" style={{ background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)' }}>
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-[#0d1117]">
              <img 
                src="/aagni-avatar.png" 
                alt="AAGNI Avatar" 
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10b981] border-2 border-[#0d1117] animate-pulse" />
            </div>
            <div>
              <h4 className="text-[15px] font-semibold tracking-wide text-white">
                AAGNI AI
              </h4>
              <span className="text-[11px] text-cyan-400/80 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block"></span>
                online
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <a 
              href="mailto:kansalbhavya27@gmail.com"
              className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
              title="Contact me"
            >
              <Mail className="w-4.5 h-4.5" />
            </a>
            <button 
              onClick={handleClearChat}
              className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
              title="Clear conversation"
            >
              <Trash2 className="w-4.5 h-4.5" />
            </button>
            <button 
              onClick={() => {
                setOpen(false);
                setShowAttachMenu(false);
              }}
              className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
              title="Close chat"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Messages feed container (Clean dark surface) */}
        <div 
          className="flex-grow overflow-y-auto p-4 scroll-smooth relative flex flex-col"
          style={{ backgroundColor: '#0d1117' }}
        >
          
          <div className="relative z-10 flex-grow flex flex-col space-y-4">
            <div className="flex justify-center my-2">
              <span className="bg-white/5 text-slate-500 text-[11px] px-3 py-1 rounded-full uppercase tracking-wider font-medium">
                Today
              </span>
            </div>

            {messages.map((msg) => {
              if (msg.sender === "system") {
                return (
                  <div key={msg.id} className="flex justify-center my-1">
                    <div className="bg-red-950/20 border border-red-500/20 text-red-300 text-xs rounded-xl px-4 py-2 text-center max-w-[85%] backdrop-blur-sm">
                      {msg.text}
                    </div>
                  </div>
                );
              }

              const isUser = msg.sender === "user";
              return (
                <div 
                  key={msg.id} 
                  className={`flex items-start ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {/* Render 3D robot avatar next to AAGNI's bot messages (No borders!) */}
                  {!isUser && (
                    <div className="w-7 h-7 rounded-full flex-shrink-0 mr-2 mt-0.5 flex items-center justify-center relative overflow-hidden bg-transparent">
                      <img 
                        src="/aagni-avatar.png" 
                        alt="AAGNI Avatar" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}

                  <div 
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[14px] relative ${
                      isUser
                        ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white"
                        : "bg-[#161b22] text-slate-200 border border-white/5"
                    }`}
                  >
                    <div 
                      className="leading-relaxed whitespace-pre-wrap break-words format-chat-text"
                      dangerouslySetInnerHTML={{ __html: formatMessageText(msg.text) }}
                    />
                    <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isUser ? 'text-white/60' : 'text-slate-500'}`}>
                      <span>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isUser && renderTicks(msg.status)}
                    </div>
                  </div>
                </div>
              );
            })}

            {aiLoading && (
              <div className="flex justify-start items-start">
                <div className="w-7 h-7 rounded-full flex-shrink-0 mr-2 mt-0.5 flex items-center justify-center relative overflow-hidden bg-transparent">
                  <img 
                    src="/aagni-avatar.png" 
                    alt="AAGNI Avatar" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="bg-[#161b22] text-slate-200 rounded-2xl px-4 py-3 min-w-[80px] border border-white/5">
                  <div className="flex items-center gap-1.5 h-4">
                    <div className="w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggestion Quick Replies */}
        <div 
          className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-none select-none z-10 border-t border-white/5"
          style={{ backgroundColor: '#0d1117' }}
        >
          {suggestionPills.map((pill) => (
            <button
              key={pill}
              onClick={() => handleSuggestionClick(pill)}
              className="flex-shrink-0 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-full px-4 py-1.5 text-xs transition-colors font-medium whitespace-nowrap border border-white/5"
            >
              {pill}
            </button>
          ))}
        </div>

        <div className="relative p-3 flex gap-2 items-end z-10 border-t border-white/5" style={{ backgroundColor: '#161b22' }}>
          
          <div className="flex-1 flex gap-2 items-end bg-[#0d1117] rounded-2xl p-1.5 min-h-[46px] border border-white/10">
            <button 
              type="button"
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-white transition-colors flex-shrink-0"
              onClick={handleEmojiClick}
              title="Emoji"
            >
              <Smile className="w-5 h-5" />
            </button>
            <button 
              type="button"
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${showAttachMenu ? "bg-white/10 text-white" : "text-slate-500 hover:text-white"}`}
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              title="Attach"
            >
              <Paperclip className="w-4.5 h-4.5" />
            </button>

            {/* Attachments Popover */}
            {showAttachMenu && (
              <div className="absolute bottom-[60px] left-4 bg-[#161b22] rounded-2xl p-2 flex flex-col gap-1 shadow-xl min-w-[200px] border border-white/10 animate-in slide-in-from-bottom-2">
                <button 
                  onClick={() => handleShareClick("email")}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-slate-300 transition-colors text-sm text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  Share Contact
                </button>
                <button 
                  onClick={() => handleShareClick("github")}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-slate-300 transition-colors text-sm text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500/15 text-blue-400 flex items-center justify-center">
                    <Globe className="w-4 h-4" />
                  </div>
                  GitHub Profile
                </button>
                <button 
                  onClick={() => handleShareClick("resume")}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-slate-300 transition-colors text-sm text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-purple-500/15 text-purple-400 flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </div>
                  Get Resume
                </button>
              </div>
            )}

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="flex-1 flex"
            >
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Message" 
                className="flex-1 bg-transparent px-2 py-1.5 text-[15px] text-white focus:outline-none placeholder-slate-500"
                disabled={aiLoading}
              />
            </form>
          </div>

          <button 
            type="button" 
            onClick={() => {
              if (inputValue.trim() && !aiLoading) {
                handleSendMessage(inputValue);
              }
            }}
            disabled={aiLoading}
            className={`w-[44px] h-[44px] rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
              inputValue.trim() 
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/20" 
                : "bg-white/5 text-slate-500"
            }`}
            title="Send message"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </div>

      </div>

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

        @keyframes slideUpCustom {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-slide-up-custom {
          animation: slideUpCustom 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .format-chat-text strong {
          font-weight: 700;
          color: #fff;
          background: linear-gradient(to right, #67e8f9, #60a5fa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .format-chat-text em {
          font-style: italic;
          color: #f1f5f9;
        }
      `}</style>
    </div>
  );
};

export default CommandPalette;
