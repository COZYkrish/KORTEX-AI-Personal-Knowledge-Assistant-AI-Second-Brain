"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Bot, User, Loader2, FileText, Copy,
  Check, ChevronDown, Mic, MicOff, Sparkles,
  BookOpen, PenTool, BarChart3, Search,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  timestamp: Date;
}

interface Citation {
  index: number;
  documentTitle: string;
  pageNumber?: number;
  excerpt: string;
}

const AGENT_MODES = [
  { id: "general", label: "General AI", icon: Bot, description: "Flexible assistant" },
  { id: "research", label: "Research", icon: Search, description: "Deep analysis" },
  { id: "study", label: "Study Coach", icon: BookOpen, description: "Learning paths" },
  { id: "summarize", label: "Summarize", icon: PenTool, description: "Concise summaries" },
  { id: "quiz", label: "Quiz Me", icon: BarChart3, description: "Generate quizzes" },
];

const DEMO_MESSAGES: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! I'm your Kortex AI assistant, powered by Gemini 2.5 Flash. I have access to all your documents in this workspace. What would you like to explore today?\n\nYou can ask me to:\n- 💡 **Explain** any concept from your documents\n- 📊 **Compare** multiple sources\n- 📝 **Summarize** key findings\n- 🔍 **Search** for specific information\n- 🎓 **Generate** quizzes and flashcards",
    citations: [],
    timestamp: new Date(),
  },
];

function CitationBadge({ citation }: { citation: Citation }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded bg-[rgba(124,58,237,0.25)] text-[#a78bfa] hover:bg-[rgba(124,58,237,0.4)] transition-colors mx-0.5 border border-[rgba(124,58,237,0.3)]"
      >
        [{citation.index}]
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="absolute bottom-full left-0 mb-2 w-64 glass-bright rounded-xl p-3 z-50 text-left shadow-xl"
          >
            <p className="text-xs font-semibold text-[#a78bfa] mb-1">
              {citation.documentTitle}
              {citation.pageNumber && ` · p.${citation.pageNumber}`}
            </p>
            <p className="text-xs text-[#a8b2d8] line-clamp-3">{citation.excerpt}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const [copied, setCopied] = useState(false);
  const isAI = msg.role === "assistant";

  const copy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render inline [N] citation markers
  const renderContent = (text: string) => {
    const parts = text.split(/(\[[0-9]+\])/g);
    return parts.map((part, i) => {
      const match = part.match(/\[([0-9]+)\]/);
      if (match && msg.citations) {
        const citation = msg.citations.find((c) => c.index === parseInt(match[1]));
        if (citation) return <CitationBadge key={i} citation={citation} />;
      }
      // Convert markdown bold
      const bold = part.split(/(\*\*[^*]+\*\*)/g).map((p, j) => {
        if (p.startsWith("**") && p.endsWith("**")) {
          return <strong key={j} className="text-white font-semibold">{p.slice(2, -2)}</strong>;
        }
        return <span key={j}>{p}</span>;
      });
      return <span key={i}>{bold}</span>;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isAI ? "" : "flex-row-reverse"}`}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isAI ? "bg-gradient-to-br from-[#7c3aed] to-[#5b21b6]" : "bg-[rgba(124,58,237,0.2)] border border-[rgba(124,58,237,0.3)]"}`}>
        {isAI ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-[#a78bfa]" />}
      </div>
      <div className={`max-w-[80%] group ${isAI ? "" : "items-end flex flex-col"}`}>
        <div className={`relative rounded-2xl px-4 py-3 text-sm leading-relaxed ${isAI ? "glass text-[#c8d0e8]" : "bg-gradient-to-br from-[#7c3aed] to-[#5b21b6] text-white"}`}>
          <div className="whitespace-pre-wrap">
            {msg.content.split("\n").map((line, i) => (
              <div key={i}>{renderContent(line)}</div>
            ))}
          </div>
          {isAI && (
            <button
              onClick={copy}
              className="absolute top-2 right-2 p-1 rounded-lg opacity-0 group-hover:opacity-100 text-[#64748b] hover:text-white hover:bg-[rgba(124,58,237,0.2)] transition-all"
              title="Copy"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
        {isAI && msg.citations && msg.citations.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {msg.citations.map((c) => (
              <span key={c.index} className="text-[10px] flex items-center gap-1 px-2 py-1 rounded-lg bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.2)] text-[#64748b]">
                <FileText className="w-3 h-3 text-[#7c3aed]" />
                {c.documentTitle}
                {c.pageNumber && ` · p.${c.pageNumber}`}
              </span>
            ))}
          </div>
        )}
        <p className="text-[10px] text-[#4a5568] mt-1 px-1">
          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </motion.div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(DEMO_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [agentMode, setAgentMode] = useState("general");
  const [listening, setListening] = useState(false);
  const [showAgents, setShowAgents] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const activeAgent = AGENT_MODES.find((a) => a.id === agentMode) ?? AGENT_MODES[0];

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Simulate streaming AI response
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      citations: [
        { index: 1, documentTitle: "Machine Learning Fundamentals", pageNumber: 42, excerpt: "Neural networks are computational models inspired by the human brain..." },
        { index: 2, documentTitle: "Deep Learning with PyTorch", pageNumber: 15, excerpt: "Gradient descent is the primary optimization algorithm used..." },
      ],
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMsg]);

    const response = `Based on your documents, here's what I found [1]:\n\n**Key Concept:** The transformer architecture revolutionized NLP by introducing self-attention mechanisms that allow models to weigh the importance of different input tokens [2].\n\n**From your knowledge base:**\n- Self-attention enables parallel processing of sequences\n- Multi-head attention captures different aspects of relationships\n- Positional encoding preserves sequence order information\n\nWould you like me to generate flashcards or a quiz on this topic?`;

    // Stream characters
    let i = 0;
    const interval = setInterval(() => {
      if (i < response.length) {
        setMessages((prev) =>
          prev.map((m) => m.id === aiMsg.id ? { ...m, content: response.slice(0, i + 1) } : m)
        );
        i++;
      } else {
        clearInterval(interval);
        setLoading(false);
      }
    }, 12);
  };

  const toggleVoice = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice recognition is not supported in this browser. Please use Chrome.");
      return;
    }
    setListening(!listening);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto">
      {/* Agent Selector */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-4">
        <div className="relative">
          <button
            id="agent-selector"
            onClick={() => setShowAgents(!showAgents)}
            className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-sm text-white hover:border-[rgba(124,58,237,0.5)] transition-colors"
          >
            <activeAgent.icon className="w-4 h-4 text-[#7c3aed]" />
            {activeAgent.label}
            <ChevronDown className={`w-3.5 h-3.5 text-[#64748b] transition-transform ${showAgents ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence>
            {showAgents && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute top-full left-0 mt-2 w-56 glass-bright rounded-2xl p-2 z-20 shadow-xl"
              >
                {AGENT_MODES.map((agent) => {
                  const Icon = agent.icon;
                  return (
                    <button
                      key={agent.id}
                      onClick={() => { setAgentMode(agent.id); setShowAgents(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${agentMode === agent.id ? "bg-[rgba(124,58,237,0.25)] text-white" : "text-[#a8b2d8] hover:bg-[rgba(124,58,237,0.1)] hover:text-white"}`}
                    >
                      <Icon className="w-4 h-4 text-[#7c3aed]" />
                      <div>
                        <div className="text-sm font-medium">{agent.label}</div>
                        <div className="text-xs text-[#64748b]">{agent.description}</div>
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)]">
          <Sparkles className="w-3.5 h-3.5 text-[#10b981]" />
          <span className="text-xs text-[#10b981] font-medium">Gemini 2.5 Flash</span>
        </div>
        <span className="text-xs text-[#64748b]">3 documents in context</span>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2 pb-4" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(124,58,237,0.3) transparent" }}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#5b21b6] flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="glass px-4 py-3 rounded-2xl">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                    className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-bright rounded-2xl p-3 mt-4">
        <textarea
          ref={inputRef}
          id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ask ${activeAgent.label} anything about your documents...`}
          rows={2}
          className="w-full bg-transparent text-white placeholder-[#4a5568] text-sm resize-none focus:outline-none"
          style={{ maxHeight: "120px" }}
        />
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <button
              id="voice-input-button"
              onClick={toggleVoice}
              className={`p-2 rounded-xl transition-all ${listening ? "bg-[rgba(239,68,68,0.2)] text-[#ef4444] border border-[rgba(239,68,68,0.3)]" : "text-[#64748b] hover:text-[#a78bfa] hover:bg-[rgba(124,58,237,0.1)]"}`}
              title="Voice input (Web Speech API)"
            >
              {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <span className="text-xs text-[#4a5568]">Enter to send · Shift+Enter for new line</span>
          </div>
          <motion.button
            id="send-message-button"
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#5b21b6] text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Send
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
