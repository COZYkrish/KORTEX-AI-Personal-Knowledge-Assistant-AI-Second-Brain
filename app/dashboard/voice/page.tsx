"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, MicOff, Volume2, VolumeX, Sparkles,
  Bot, User, Settings2, ChevronDown, Loader2,
  BookOpen, MessageSquare, Search, PenTool, BarChart3,
  ChevronRight,
} from "lucide-react";

const AGENT_MODES = [
  { id: "general", label: "General AI", icon: Bot, color: "#7c3aed" },
  { id: "research", label: "Research", icon: Search, color: "#00d4ff" },
  { id: "study", label: "Study Coach", icon: BookOpen, color: "#10b981" },
  { id: "summarize", label: "Summarize", icon: PenTool, color: "#f59e0b" },
  { id: "quiz", label: "Quiz Me", icon: BarChart3, color: "#ef4444" },
];

const EXAMPLE_QUESTIONS = [
  "Explain backpropagation in simple terms",
  "What are the key differences between CNN and RNN?",
  "Summarize my Machine Learning document",
  "Create a quiz about transformer architectures",
  "How does gradient descent work?",
];

interface Transcript {
  id: string;
  role: "user" | "ai";
  text: string;
  timestamp: Date;
}

const AI_RESPONSES: Record<string, string> = {
  default: "I heard your question. Based on your knowledge base, I can tell you that this topic is covered extensively in your uploaded documents. The key concept here relates to how neural networks learn through iterative optimization. Would you like me to go deeper on any specific aspect?",
  "explain backpropagation": "Backpropagation works by computing how much each weight in the network contributed to the error. Think of it like reverse-engineering blame — we start from the output error and work backwards, using the chain rule of calculus to calculate gradients at each layer. These gradients then guide weight updates via gradient descent.",
};

function WaveformBar({ active, height }: { active: boolean; height: number }) {
  return (
    <motion.div
      animate={active ? {
        scaleY: [1, height, 0.5, height * 0.7, 1],
        transition: { repeat: Infinity, duration: 0.6 + Math.random() * 0.4, ease: "easeInOut" }
      } : { scaleY: 0.15 }}
      className="w-1 rounded-full origin-bottom"
      style={{
        height: "40px",
        background: active
          ? "linear-gradient(to top, #7c3aed, #00d4ff)"
          : "rgba(124,58,237,0.3)",
      }}
    />
  );
}

export default function VoicePage() {
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [agentMode, setAgentMode] = useState("general");
  const [showModes, setShowModes] = useState(false);
  const [transcript, setTranscript] = useState<Transcript[]>([]);
  const [currentText, setCurrentText] = useState("");
  const [muted, setMuted] = useState(false);
  const [supported, setSupported] = useState(true);
  const [loading, setLoading] = useState(false);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSupported("webkitSpeechRecognition" in window || "SpeechRecognition" in window);
    }
  }, []);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  const activeAgent = AGENT_MODES.find((a) => a.id === agentMode) ?? AGENT_MODES[0];

  const toggleListening = () => {
    if (!supported) return;
    if (listening) {
      setListening(false);
      if (currentText.trim()) {
        processVoiceInput(currentText);
      }
      setCurrentText("");
    } else {
      setListening(true);
      // Simulate voice recognition
      let sampleText = EXAMPLE_QUESTIONS[Math.floor(Math.random() * EXAMPLE_QUESTIONS.length)];
      let i = 0;
      const interval = setInterval(() => {
        if (i <= sampleText.length) {
          setCurrentText(sampleText.slice(0, i));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 40);
    }
  };

  const processVoiceInput = async (text: string) => {
    const userMsg: Transcript = {
      id: Date.now().toString(),
      role: "user",
      text,
      timestamp: new Date(),
    };
    setTranscript((prev) => [...prev, userMsg]);
    setListening(false);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));

    const lowerText = text.toLowerCase();
    const response = Object.keys(AI_RESPONSES).find((k) => lowerText.includes(k))
      ? AI_RESPONSES[Object.keys(AI_RESPONSES).find((k) => lowerText.includes(k))!]
      : AI_RESPONSES.default;

    const aiMsg: Transcript = {
      id: (Date.now() + 1).toString(),
      role: "ai",
      text: response,
      timestamp: new Date(),
    };
    setTranscript((prev) => [...prev, aiMsg]);
    setLoading(false);

    // Simulate TTS
    if (!muted && "speechSynthesis" in window) {
      setSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(response);
      utterance.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const askExample = (q: string) => {
    setCurrentText(q);
    setTimeout(() => processVoiceInput(q), 200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 h-full flex flex-col">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Voice AI</h1>
          <p className="text-[#a8b2d8] text-sm mt-0.5">Talk to your knowledge base naturally</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Mute toggle */}
          <button
            id="voice-mute-button"
            onClick={() => setMuted(!muted)}
            className={`p-2.5 glass rounded-xl transition-all ${muted ? "text-[#ef4444] border-[rgba(239,68,68,0.3)]" : "text-[#64748b] hover:text-white"}`}
            title={muted ? "Unmute AI voice" : "Mute AI voice"}
          >
            {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Agent mode */}
          <div className="relative">
            <button
              id="voice-agent-selector"
              onClick={() => setShowModes(!showModes)}
              className="flex items-center gap-2 px-4 py-2.5 glass rounded-xl text-sm text-white hover:border-[rgba(124,58,237,0.5)] transition-colors"
            >
              <activeAgent.icon className="w-4 h-4" style={{ color: activeAgent.color }} />
              {activeAgent.label}
              <ChevronDown className={`w-3.5 h-3.5 text-[#64748b] transition-transform ${showModes ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {showModes && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute top-full right-0 mt-2 w-48 glass-bright rounded-2xl p-2 z-20 shadow-xl"
                >
                  {AGENT_MODES.map((agent) => {
                    const Icon = agent.icon;
                    return (
                      <button
                        key={agent.id}
                        onClick={() => { setAgentMode(agent.id); setShowModes(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${agentMode === agent.id ? "bg-[rgba(124,58,237,0.25)] text-white" : "text-[#a8b2d8] hover:bg-[rgba(124,58,237,0.1)] hover:text-white"}`}
                      >
                        <Icon className="w-4 h-4" style={{ color: agent.color }} />
                        <span className="text-sm">{agent.label}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Central mic area */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-bright rounded-3xl p-10 flex flex-col items-center gap-6 shrink-0"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.12) 0%, transparent 60%), rgba(13,20,64,0.8)",
        }}
      >
        {/* Waveform */}
        <div className="flex items-end gap-1 h-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <WaveformBar key={i} active={listening || speaking} height={0.3 + Math.sin(i * 0.5) * 0.7} />
          ))}
        </div>

        {/* Mic Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={listening ? {
            boxShadow: [
              "0 0 0 0 rgba(124,58,237,0.4)",
              "0 0 0 20px rgba(124,58,237,0)",
            ],
            transition: { repeat: Infinity, duration: 1.2 }
          } : {}}
          onClick={toggleListening}
          disabled={!supported}
          id="voice-mic-button"
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
            listening
              ? "bg-gradient-to-br from-[#ef4444] to-[#dc2626]"
              : "bg-gradient-to-br from-[#7c3aed] to-[#5b21b6]"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          style={{
            boxShadow: listening
              ? "0 0 40px rgba(239,68,68,0.5)"
              : "0 0 40px rgba(124,58,237,0.5), 0 0 80px rgba(124,58,237,0.2)",
          }}
        >
          {listening ? (
            <MicOff className="w-10 h-10 text-white" />
          ) : (
            <Mic className="w-10 h-10 text-white" />
          )}
        </motion.button>

        {/* Status text */}
        <div className="text-center min-h-[48px]">
          {!supported ? (
            <p className="text-[#ef4444] text-sm">Voice recognition not supported in this browser. Use Chrome.</p>
          ) : listening ? (
            <div>
              <p className="text-[#a78bfa] text-sm font-medium animate-pulse">Listening...</p>
              {currentText && (
                <p className="text-white text-base mt-1 font-medium">&quot;{currentText}&quot;</p>
              )}
            </div>
          ) : loading ? (
            <div className="flex items-center gap-2 text-[#a8b2d8]">
              <Loader2 className="w-4 h-4 animate-spin text-[#7c3aed]" />
              <span className="text-sm">Processing...</span>
            </div>
          ) : speaking ? (
            <p className="text-[#10b981] text-sm font-medium">AI is speaking...</p>
          ) : (
            <p className="text-[#64748b] text-sm">Tap the microphone to start talking</p>
          )}
        </div>

        {/* AI model indicator */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full glass">
          <Sparkles className="w-3.5 h-3.5 text-[#10b981]" />
          <span className="text-xs text-[#10b981] font-medium">Gemini 2.5 Flash</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
          <span className="text-xs text-[#64748b] ml-1">Web Speech API</span>
        </div>
      </motion.div>

      {/* Two columns: Transcript + Examples */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
        {/* Transcript */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass rounded-2xl p-5 flex flex-col min-h-0"
          style={{ maxHeight: "320px" }}
        >
          <div className="flex items-center gap-2 mb-4 shrink-0">
            <MessageSquare className="w-4 h-4 text-[#7c3aed]" />
            <span className="text-sm font-semibold text-white">Conversation</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3" style={{ scrollbarWidth: "thin" }}>
            {transcript.length === 0 ? (
              <div className="text-center py-8">
                <Mic className="w-8 h-8 text-[rgba(124,58,237,0.3)] mx-auto mb-2" />
                <p className="text-sm text-[#4a5568]">Your conversation will appear here</p>
              </div>
            ) : (
              transcript.map((t) => (
                <div key={t.id} className={`flex gap-3 ${t.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${t.role === "ai" ? "bg-gradient-to-br from-[#7c3aed] to-[#5b21b6]" : "glass border border-[rgba(124,58,237,0.3)]"}`}>
                    {t.role === "ai" ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-[#a78bfa]" />}
                  </div>
                  <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${t.role === "ai" ? "glass text-[#c8d0e8]" : "bg-gradient-to-br from-[#7c3aed] to-[#5b21b6] text-white"}`}>
                    {t.text}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#5b21b6] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="glass px-3 py-2 rounded-xl">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.15 }} className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]" />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={transcriptEndRef} />
          </div>
        </motion.div>

        {/* Example questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass rounded-2xl p-5"
          style={{ maxHeight: "320px", overflow: "hidden" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Settings2 className="w-4 h-4 text-[#7c3aed]" />
            <span className="text-sm font-semibold text-white">Try Asking</span>
          </div>
          <div className="space-y-2">
            {EXAMPLE_QUESTIONS.map((q) => (
              <motion.button
                key={q}
                whileHover={{ x: 3 }}
                onClick={() => askExample(q)}
                className="w-full text-left px-3 py-2.5 rounded-xl glass text-xs text-[#a8b2d8] hover:text-white hover:border-[rgba(124,58,237,0.4)] transition-all group"
              >
                <ChevronRight className="w-3.5 h-3.5 text-[#7c3aed] inline mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                &quot;{q}&quot;
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
