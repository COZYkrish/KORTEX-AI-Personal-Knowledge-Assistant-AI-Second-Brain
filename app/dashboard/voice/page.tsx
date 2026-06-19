"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, MicOff, Volume2, VolumeX, Sparkles,
  Bot, User, Settings2, ChevronDown, Loader2,
  BookOpen, MessageSquare, Search, PenTool, BarChart3,
  ChevronRight,
} from "lucide-react";
import { B } from "@/lib/bauhaus";

const AGENT_MODES = [
  { id: "general", label: "General AI", icon: Bot, color: B.BLUE },
  { id: "research", label: "Research", icon: Search, color: B.RED },
  { id: "study", label: "Study Coach", icon: BookOpen, color: B.YELLOW },
  { id: "summarize", label: "Summarize", icon: PenTool, color: B.BLUE },
  { id: "quiz", label: "Quiz Me", icon: BarChart3, color: B.RED },
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
  // Rotate colors between Red, Blue, Yellow
  const colors = [B.BLUE, B.RED, B.YELLOW];
  const barColor = colors[Math.floor(Math.random() * 3)];
  return (
    <motion.div
      animate={active ? {
        scaleY: [1, height, 0.5, height * 0.7, 1],
        transition: { repeat: Infinity, duration: 0.6 + Math.random() * 0.4, ease: "easeInOut" }
      } : { scaleY: 0.15 }}
      className="w-1.5 rounded-none origin-bottom shrink-0"
      style={{
        height: "40px",
        background: active ? barColor : "#12121225",
        border: active ? "1.5px solid #121212" : "none",
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
    <div className="max-w-4xl mx-auto space-y-8 pb-12 h-full flex flex-col">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
        <div>
          <h1 className="font-display text-4xl font-black uppercase tracking-tight text-[#121212]" style={B.displayStyle}>
            Voice AI
          </h1>
          <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mt-1" style={B.labelStyle}>
            Speak queries to your documents with natural speech interaction
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-center">
          {/* Mute button */}
          <button
            onClick={() => setMuted(!muted)}
            id="voice-mute-button"
            className="p-3 bg-white border-2 border-[#121212] text-[#121212] font-black shadow-[3px_3px_0px_0px_#121212] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#121212] transition-all cursor-pointer rounded-none hover:bg-gray-50"
            title={muted ? "Unmute AI voice" : "Mute AI voice"}
          >
            {muted ? <VolumeX className="w-5 h-5 text-[#D02020]" /> : <Volume2 className="w-5 h-5 text-[#1040C0]" />}
          </button>

          {/* Agent selection drop */}
          <div className="relative">
            <button
              id="voice-agent-selector"
              onClick={() => setShowModes(!showModes)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-[#121212] text-sm text-[#121212] font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_#121212] cursor-pointer rounded-none hover:bg-gray-50"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              <activeAgent.icon className="w-4.5 h-4.5 text-[#1040C0]" />
              <span>{activeAgent.label}</span>
              <ChevronDown className={`w-4 h-4 text-[#121212] transition-transform ${showModes ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {showModes && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute top-full right-0 mt-2 w-56 bg-white border-2 border-[#121212] p-2 z-20 shadow-[6px_6px_0px_0px_#121212] rounded-none"
                >
                  {AGENT_MODES.map((agent) => {
                    const Icon = agent.icon;
                    const isSelected = agentMode === agent.id;
                    return (
                      <button
                        key={agent.id}
                        onClick={() => { setAgentMode(agent.id); setShowModes(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2 border ${
                          isSelected ? "bg-[#1040C0] text-white border-[#121212]" : "text-[#121212] border-transparent hover:bg-gray-100"
                        } cursor-pointer rounded-none font-bold uppercase text-xs tracking-wide`}
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                      >
                        <Icon className={`w-4.5 h-4.5 ${isSelected ? "text-white" : "text-[#1040C0]"}`} />
                        <span>{agent.label}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Central Mic Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}
        className="bg-white border-4 border-[#121212] p-12 flex flex-col items-center gap-8 shadow-[8px_8px_0px_0px_#121212] rounded-none text-center shrink-0"
      >
        {/* Visualizer Waveform */}
        <div className="flex items-end gap-1.5 h-12">
          {Array.from({ length: 30 }).map((_, i) => (
            <WaveformBar key={i} active={listening || speaking} height={0.3 + Math.sin(i * 0.4) * 0.7} />
          ))}
        </div>

        {/* Mic Button */}
        <button
          onClick={toggleListening}
          disabled={!supported}
          id="voice-mic-button"
          className={`w-24 h-24 border-4 border-[#121212] rounded-full flex items-center justify-center transition-all shadow-[6px_6px_0px_0px_#121212] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#121212] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            listening ? "bg-[#D02020]" : "bg-[#1040C0]"
          }`}
        >
          {listening ? (
            <MicOff className="w-10 h-10 text-white" />
          ) : (
            <Mic className="w-10 h-10 text-white" />
          )}
        </button>

        {/* Text / Recognition Display */}
        <div className="min-h-[48px] max-w-xl">
          {!supported ? (
            <p className="text-[#D02020] font-black uppercase text-xs tracking-wider" style={B.labelStyle}>Speech recognition API is unsupported in this browser environment.</p>
          ) : listening ? (
            <div>
              <p className="text-[#1040C0] font-black uppercase text-xs tracking-wider animate-pulse" style={B.labelStyle}>Ingesting Audio feed...</p>
              {currentText && (
                <p className="text-[#121212] font-black text-xl mt-3 leading-snug" style={{ fontFamily: "'Outfit', sans-serif" }}>&quot;{currentText}&quot;</p>
              )}
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center gap-2 text-gray-500 font-bold uppercase tracking-wider text-xs" style={B.labelStyle}>
              <Loader2 className="w-4 h-4 animate-spin text-[#1040C0]" />
              <span>Processing NLP response...</span>
            </div>
          ) : speaking ? (
            <p className="text-[#1040C0] font-black uppercase text-xs tracking-wider animate-bounce" style={B.labelStyle}>Synthesizing voice response...</p>
          ) : (
            <p className="text-gray-500 font-bold uppercase tracking-wider text-xs" style={B.labelStyle}>Tap the microphone unit to initiate session</p>
          )}
        </div>

        {/* System parameters indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F0C020] border-2 border-[#121212] text-[#121212] font-black uppercase text-xs tracking-wider shadow-[2px_2px_0px_0px_#121212]" style={{ fontFamily: "'Outfit', sans-serif" }}>
          <Sparkles className="w-4 h-4" />
          <span>Gemini 2.5 Active</span>
          <span className="w-1.5 h-1.5 bg-emerald-600 border border-black rounded-none animate-pulse" />
        </div>
      </motion.div>

      {/* Two columns: Dialogue transcript + Example Questions */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
        {/* Transcript Box */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white border-2 border-[#121212] p-5 flex flex-col min-h-0 shadow-[4px_4px_0px_0px_#121212] rounded-none"
          style={{ maxHeight: "350px" }}
        >
          <div className="flex items-center gap-2 mb-4 border-b border-[#121212] pb-2 shrink-0">
            <MessageSquare className="w-4.5 h-4.5 text-[#1040C0]" />
            <span className="text-xs font-black uppercase tracking-wider text-black" style={B.labelStyle}>Dialogue Transcript</span>
          </div>
          <div className="flex-grow overflow-y-auto space-y-4 pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "#121212 #ffffff" }}>
            {transcript.length === 0 ? (
              <div className="text-center py-12">
                <Mic className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider" style={B.labelStyle}>Conversation history is empty</p>
              </div>
            ) : (
              transcript.map((t) => {
                const isAI = t.role === "ai";
                return (
                  <div key={t.id} className={`flex gap-3 ${!isAI ? "flex-row-reverse" : ""}`}>
                    <div className={`w-8 h-8 border-2 border-[#121212] flex items-center justify-center shrink-0 shadow-[1px_1px_0px_0px_#121212] rounded-none ${isAI ? "bg-[#D02020] text-white" : "bg-[#1040C0] text-white"}`}>
                      {isAI ? <Bot className="w-4.5 h-4.5" /> : <User className="w-4.5 h-4.5" />}
                    </div>
                    <div className={`max-w-[80%] border-2 border-[#121212] px-4 py-2.5 shadow-[2px_2px_0px_0px_#121212] text-xs font-bold uppercase tracking-wider rounded-none ${
                      isAI ? "bg-white text-[#121212]" : "bg-[#F0C020] text-[#121212]"
                    }`} style={{ fontFamily: "'Outfit', sans-serif" }}>
                      {t.text}
                    </div>
                  </div>
                );
              })
            )}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 border-2 border-[#121212] bg-[#D02020] text-white flex items-center justify-center shadow-[1px_1px_0px_0px_#121212] rounded-none">
                  <Bot className="w-4.5 h-4.5" />
                </div>
                <div className="bg-white border-2 border-[#121212] px-4 py-2 shadow-[2px_2px_0px_0px_#121212] rounded-none">
                  <div className="flex gap-1.5 py-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.15 }} className="w-1.5 h-1.5 bg-[#121212]" />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={transcriptEndRef} />
          </div>
        </motion.div>

        {/* Examples questions box */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white border-2 border-[#121212] p-5 shadow-[4px_4px_0px_0px_#121212] rounded-none flex flex-col"
          style={{ maxHeight: "350px" }}
        >
          <div className="flex items-center gap-2 mb-4 border-b border-[#121212] pb-2 shrink-0">
            <Settings2 className="w-4.5 h-4.5 text-[#1040C0]" />
            <span className="text-xs font-black uppercase tracking-wider text-black" style={B.labelStyle}>Suggested Prompts</span>
          </div>
          <div className="space-y-3 overflow-y-auto pr-1 flex-grow" style={{ scrollbarWidth: "none" }}>
            {EXAMPLE_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => askExample(q)}
                className="w-full text-left px-3 py-3 bg-white border border-[#121212] shadow-[2px_2px_0px_0px_#121212] text-xs font-bold uppercase tracking-wide text-black hover:bg-gray-55 active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-[1px_1px_0px_0px_#121212] transition-all cursor-pointer rounded-none flex items-center justify-between"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                <span>{q}</span>
                <ChevronRight className="w-4 h-4 text-[#1040C0]" />
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
