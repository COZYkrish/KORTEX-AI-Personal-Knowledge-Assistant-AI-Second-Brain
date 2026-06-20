"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Bot, User, Loader2, FileText, Copy,
  Check, ChevronDown, Mic, MicOff, Sparkles,
  BookOpen, PenTool, BarChart3, Search,
} from "lucide-react";
import { B } from "@/lib/bauhaus";

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
    <span className="relative inline-block mx-0.5">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center text-[10px] font-black px-1.5 py-0.5 bg-[#F0C020] text-[#121212] border border-[#121212] hover:bg-[#d4a818] cursor-pointer"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        [{citation.index}]
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="absolute bottom-full left-0 mb-2 w-64 bg-white border-2 border-[#121212] p-3 z-50 text-left shadow-[4px_4px_0px_0px_#121212]"
          >
            <p className="text-xs font-black text-[#1040C0] uppercase tracking-wider mb-1" style={B.labelStyle}>
              {citation.documentTitle}
              {citation.pageNumber && ` · p.${citation.pageNumber}`}
            </p>
            <p className="text-xs text-[#121212] font-semibold leading-relaxed">{citation.excerpt}</p>
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
          return <strong key={j} className="text-[#121212] font-black">{p.slice(2, -2)}</strong>;
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
      className={`flex gap-4 ${isAI ? "" : "flex-row-reverse"}`}
    >
      <div className={`w-9 h-9 border-2 border-[#121212] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#121212] ${isAI ? "bg-[#D02020] text-white" : "bg-[#1040C0] text-white"}`}>
        {isAI ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
      </div>
      <div className={`max-w-[80%] group ${isAI ? "" : "items-end flex flex-col"}`}>
        <div className={`relative border-2 border-[#121212] px-5 py-4 text-sm leading-relaxed shadow-[4px_4px_0px_0px_#121212] ${isAI ? "bg-white text-[#121212]" : "bg-[#F0C020] text-[#121212]"}`}>
          <div className="whitespace-pre-wrap font-semibold" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {msg.content.split("\n").map((line, i) => (
              <div key={i}>{renderContent(line)}</div>
            ))}
          </div>
          {isAI && (
            <button
              onClick={copy}
              className="absolute top-2 right-2 p-1 border border-transparent hover:border-[#121212] hover:bg-gray-100 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-[#121212] transition-all cursor-pointer"
              title="Copy"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
        {isAI && msg.citations && msg.citations.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {msg.citations.map((c) => (
              <span key={c.index} className="text-[10px] font-black flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#121212] text-[#121212]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                <FileText className="w-3.5 h-3.5 text-[#1040C0]" />
                {c.documentTitle}
                {c.pageNumber && ` · p.${c.pageNumber}`}
              </span>
            ))}
          </div>
        )}
        <p className="text-[10px] font-bold text-gray-400 uppercase mt-2 tracking-wider px-1" style={B.labelStyle}>
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
  const [docsCount, setDocsCount] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    fetch("/api/documents")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDocsCount(data.filter((d) => d.status === "READY").length);
        }
      })
      .catch((err) => console.error("Error loading docs count:", err));
  }, []);

  const activeAgent = AGENT_MODES.find((a) => a.id === agentMode) ?? AGENT_MODES[0];

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const queryText = input.trim();
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: queryText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const aiMsgId = (Date.now() + 1).toString();
    const aiMsg: Message = {
      id: aiMsgId,
      role: "assistant",
      content: "",
      citations: [],
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMsg]);

    try {
      const history = messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({
          role: m.role === "user" ? ("user" as const) : ("model" as const),
          content: m.content,
        }))
        .slice(-6); // Last 3 turns of back-and-forth

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: queryText,
          history,
          agent: agentMode,
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No reader available");

      let done = false;
      let buffer = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const chunk = JSON.parse(line);
              if (chunk.type === "chunk") {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === aiMsgId ? { ...m, content: m.content + chunk.value } : m
                  )
                );
              } else if (chunk.type === "citations") {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === aiMsgId ? { ...m, citations: chunk.value } : m
                  )
                );
              }
            } catch (err) {
              console.error("Error parsing stream line:", err);
            }
          }
        }
      }
    } catch (err) {
      console.error("Error in chat execution:", err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsgId
            ? {
                ...m,
                content:
                  "Sorry, I experienced an error trying to process this query. Please check that your Gemini API key is configured.",
              }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
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
    <div className="h-full flex flex-col max-w-5xl mx-auto pb-6">
      {/* Agent Selector & context stats */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative">
          <button
            id="agent-selector"
            onClick={() => setShowAgents(!showAgents)}
            className="flex items-center gap-2 px-4 py-2 bg.white bg-white border-2 border-[#121212] text-sm text-[#121212] font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_#121212] cursor-pointer hover:bg-gray-50"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            <activeAgent.icon className="w-4 h-4 text-[#1040C0]" />
            {activeAgent.label}
            <ChevronDown className={`w-4 h-4 text-[#121212] transition-transform ${showAgents ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence>
            {showAgents && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute top-full left-0 mt-2 w-64 bg-white border-2 border-[#121212] p-2 z-20 shadow-[6px_6px_0px_0px_#121212]"
              >
                {AGENT_MODES.map((agent) => {
                  const Icon = agent.icon;
                  const isSelected = agentMode === agent.id;
                  return (
                    <button
                      key={agent.id}
                      onClick={() => { setAgentMode(agent.id); setShowAgents(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left border ${isSelected ? "bg-[#1040C0] text-white border-[#121212]" : "text-[#121212] border-transparent hover:bg-gray-100"} cursor-pointer`}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? "text-white" : "text-[#1040C0]"}`} />
                      <div>
                        <div className="text-sm font-black uppercase tracking-wide" style={{ fontFamily: "'Outfit', sans-serif" }}>{agent.label}</div>
                        <div className={`text-xs ${isSelected ? "text-blue-100" : "text-gray-500"} font-bold`} style={{ fontFamily: "'Outfit', sans-serif" }}>{agent.description}</div>
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-2 bg-[#F0C020] border-2 border-[#121212] text-[#121212] font-black uppercase text-xs tracking-wider shadow-[2px_2px_0px_0px_#121212]" style={{ fontFamily: "'Outfit', sans-serif" }}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini 2.5 Flash</span>
        </div>
        <span className="text-xs font-black uppercase tracking-wider text-gray-500" style={B.labelStyle}>{docsCount} documents in context</span>
      </motion.div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2 pb-6 border-2 border-[#121212] bg-white p-6 shadow-[6px_6px_0px_0px_#121212]" style={{ scrollbarWidth: "thin", scrollbarColor: "#121212 #ffffff" }}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        {loading && (
          <div className="flex gap-4">
            <div className="w-9 h-9 border-2 border-[#121212] bg-[#D02020] text-white flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#121212]">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-white border-2 border-[#121212] px-5 py-3 shadow-[4px_4px_0px_0px_#121212]">
              <div className="flex gap-1.5 py-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                    className="w-2 h-2 bg-[#121212]"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Message Input Box */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border-2 border-[#121212] p-4 mt-6 shadow-[6px_6px_0px_0px_#121212]">
        <textarea
          ref={inputRef}
          id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ask ${activeAgent.label} anything about your documents...`}
          rows={2}
          className="w-full bg-transparent text-[#121212] placeholder-gray-400 text-sm font-semibold resize-none focus:outline-none"
          style={{ maxHeight: "120px", fontFamily: "'Outfit', sans-serif" }}
        />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-3 border-t-2 border-dashed border-[#121212] pt-3">
          <div className="flex items-center gap-2">
            <button
              id="voice-input-button"
              onClick={toggleVoice}
              className={`p-2 border-2 border-[#121212] transition-all cursor-pointer shadow-[2px_2px_0px_0px_#121212] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#121212] ${
                listening
                  ? "bg-[#D02020] text-white"
                  : "bg-white text-[#121212] hover:bg-gray-100"
              }`}
              title="Voice input (Web Speech API)"
            >
              {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500" style={B.labelStyle}>
              Enter to send · Shift+Enter for new line
            </span>
          </div>
          <button
            id="send-message-button"
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#D02020] text-white border-2 border-[#121212] font-black uppercase tracking-wider text-xs shadow-[3px_3px_0px_0px_#121212] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#121212]"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Send
          </button>
        </div>
      </motion.div>
    </div>
  );
}
