"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PenTool, Sparkles, Bold, Italic, List, AlignLeft,
  Brain, Copy, Check, Trash2, Download, Wand2, FileText,
  ChevronDown, MessageSquare, BookOpen, Loader2,
} from "lucide-react";
import { B } from "@/lib/bauhaus";

const AI_ACTIONS = [
  { id: "improve", label: "Improve Writing", icon: Wand2, bg: "#1040C0", text: "#ffffff" },
  { id: "summarize", label: "Summarize", icon: FileText, bg: "#D02020", text: "#ffffff" },
  { id: "expand", label: "Expand Prose", icon: AlignLeft, bg: "#F0C020", text: "#121212" },
  { id: "bullets", label: "Bullet Points", icon: List, bg: "#ffffff", text: "#121212" },
  { id: "quiz", label: "Generate Quiz", icon: BookOpen, bg: "#D02020", text: "#ffffff" },
  { id: "chat", label: "Ask Assistant", icon: MessageSquare, bg: "#1040C0", text: "#ffffff" },
];

const TEMPLATES = [
  { label: "Research Notes", content: "## Research Notes\n\n### Topic: \n\n### Key Findings\n1. \n2. \n\n### Sources\n- \n\n### Summary\n" },
  { label: "Study Plan", content: "## Study Plan\n\n### Goal: \n\n### Week 1\n- [ ] \n- [ ] \n\n### Week 2\n- [ ] \n\n### Resources\n- \n" },
  { label: "Brainstorm", content: "## Brainstorm Session\n\n### Central Idea: \n\n### Related Concepts\n- \n- \n\n### Questions to Explore\n- \n\n### Action Items\n- [ ] \n" },
];

export default function WorkspacePage() {
  const [content, setContent] = useState(
    "## Welcome to your AI Workspace\n\nStart writing, or choose an AI action to get started. This is your personal canvas for thinking, researching, and creating.\n\n"
  );
  const [aiOutput, setAiOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [wordCount, setWordCount] = useState(19);
  const [showTemplates, setShowTemplates] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleContent = (val: string) => {
    setContent(val);
    setWordCount(val.trim().split(/\s+/).filter(Boolean).length);
  };

  const runAI = async (actionId: string) => {
    if (!content.trim() || loading) return;
    setLoading(true);
    setActiveAction(actionId);
    setAiOutput(null);

    // Simulate AI response
    await new Promise((r) => setTimeout(r, 1800));

    const outputs: Record<string, string> = {
      improve: "**Improved Version:**\n\nYour text has been refined for clarity and concision. The key ideas are preserved while the prose flows more naturally. Technical terms are used precisely, and the argument structure is strengthened with better transitions.",
      summarize: "**Summary:**\n\n• This workspace enables AI-powered writing and research\n• Users can leverage multiple AI actions to transform their content\n• The tool supports brainstorming, note-taking, and knowledge creation\n• Integration with your document knowledge base provides contextual assistance",
      expand: "**Expanded Version:**\n\nThis AI Workspace represents a paradigm shift in how knowledge workers interact with their documents and ideas. Rather than treating writing as a solitary endeavor, it transforms the process into a collaborative dialogue between human creativity and artificial intelligence...",
      bullets: "**Key Points:**\n\n• AI Workspace provides a distraction-free writing environment\n• Multiple AI transformation modes available (improve, expand, summarize)\n• Direct integration with your knowledge base for contextual assistance\n• Templates available for common document types\n• Export and share capabilities built in",
      quiz: "**Quiz Generated:**\n\n**Q1:** What is the primary purpose of the AI Workspace?\n*A: To provide an AI-enhanced writing and thinking environment*\n\n**Q2:** Which AI actions are available in the workspace?\n*A: Improve, Summarize, Expand, Bullets, Quiz, and Chat*\n\n**Q3:** How does the workspace connect to your knowledge base?\n*A: Through integrated RAG (Retrieval-Augmented Generation)*",
      chat: "**AI Analysis:**\n\nBased on your current content, I can see you're working on an introduction to the workspace. Your writing establishes context well. I'd suggest:\n\n1. Adding specific use cases to make it more concrete\n2. Including a call-to-action for the reader\n3. Perhaps referencing your existing documents for more depth\n\nWould you like me to expand on any of these suggestions?",
    };

    setAiOutput(outputs[actionId] ?? "AI response generated successfully.");
    setLoading(false);
    setActiveAction(null);
  };

  const copyAiOutput = () => {
    if (aiOutput) {
      navigator.clipboard.writeText(aiOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const applyToEditor = () => {
    if (aiOutput) {
      setContent(content + "\n\n---\n\n" + aiOutput);
      setAiOutput(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 h-full flex flex-col pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0"
      >
        <div>
          <h1 className="font-display text-4xl font-black uppercase tracking-tight text-[#121212]" style={B.displayStyle}>
            Workspace
          </h1>
          <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mt-1" style={B.labelStyle}>
            {wordCount} words · AI-powered writing canvas
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Templates */}
          <div className="relative">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-[#121212] text-sm text-[#121212] font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_#121212] cursor-pointer rounded-none hover:bg-gray-50"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              <PenTool className="w-4 h-4 text-[#1040C0]" />
              <span>Templates</span>
              <ChevronDown className={`w-4 h-4 text-[#121212] transition-transform ${showTemplates ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {showTemplates && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute top-full right-0 mt-2 w-52 bg-white border-2 border-[#121212] p-2 z-20 shadow-[6px_6px_0px_0px_#121212] rounded-none"
                >
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.label}
                      onClick={() => { setContent(t.content); setShowTemplates(false); }}
                      className="w-full text-left px-3 py-2.5 border border-transparent hover:border-[#121212] hover:bg-gray-100 transition-all font-bold uppercase text-xs text-[#121212] cursor-pointer"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      {t.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={() => {
              const blob = new Blob([content], { type: "text/markdown" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "workspace.md";
              a.click();
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-[#121212] text-sm text-[#121212] font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_#121212] cursor-pointer rounded-none hover:bg-gray-55"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            <Download className="w-4 h-4 text-[#1040C0]" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setContent("")}
            className="p-3 bg-white border-2 border-[#121212] text-[#121212] hover:bg-[#D02020] hover:text-white transition-all cursor-pointer rounded-none shadow-[2px_2px_0px_0px_#121212] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#121212]"
            title="Clear editor content"
          >
            <Trash2 className="w-4.5 h-4.5" />
          </button>
        </div>
      </motion.div>

      {/* AI Actions Row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex items-center gap-3 flex-wrap shrink-0 border-b-2 border-dashed border-[#121212] pb-4"
      >
        <div className="flex items-center gap-1.5 text-xs font-black text-gray-500 uppercase tracking-wider" style={B.labelStyle}>
          <Sparkles className="w-4.5 h-4.5 text-[#121212] shrink-0" />
          <span>AI actions:</span>
        </div>
        {AI_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => runAI(action.id)}
              disabled={loading}
              id={`ai-action-${action.id}`}
              className="flex items-center gap-1.5 px-3.5 py-1.5 border-2 border-[#121212] font-black uppercase text-[10px] tracking-wider transition-all shadow-[2px_2px_0px_0px_#121212] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#121212] disabled:opacity-40 disabled:cursor-not-allowed rounded-none cursor-pointer"
              style={{
                background: action.bg,
                color: action.text,
                fontFamily: "'Outfit', sans-serif"
              }}
            >
              {loading && activeAction === action.id ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Icon className="w-3.5 h-3.5" />
              )}
              <span>{action.label}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Main editor area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
        {/* Editor component wrapper */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white border-4 border-[#121212] shadow-[6px_6px_0px_0px_#121212] rounded-none flex flex-col"
        >
          {/* Formatting toolbar */}
          <div className="flex items-center gap-1 px-4 py-2 border-b-2 border-[#121212] bg-[#F0F0F0]">
            {[
              { icon: Bold, title: "Bold text" },
              { icon: Italic, title: "Italic text" },
              { icon: List, title: "List items" },
            ].map(({ icon: Icon, title }) => (
              <button
                key={title}
                title={title}
                className="p-1.5 border border-transparent hover:border-[#121212] hover:bg-white text-[#121212] transition-colors cursor-pointer rounded-none"
              >
                <Icon className="w-4 h-4 text-[#121212]" />
              </button>
            ))}
            <div className="w-0.5 h-5 bg-[#121212] mx-2" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-auto" style={B.labelStyle}>Markdown supported</span>
          </div>

          <textarea
            ref={textareaRef}
            id="workspace-editor"
            value={content}
            onChange={(e) => handleContent(e.target.value)}
            placeholder="Start writing... Markdown is supported."
            className="flex-grow w-full bg-transparent text-[#121212] placeholder-gray-400 text-sm font-semibold leading-relaxed resize-none focus:outline-none p-6 font-mono"
            style={{ minHeight: "380px" }}
          />
        </motion.div>

        {/* AI Output Panel + statistics */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col gap-6"
        >
          {/* AI Output Box */}
          <div className="bg-white border-4 border-[#121212] p-5 flex flex-col shadow-[6px_6px_0px_0px_#121212] rounded-none flex-1 min-h-0">
            <div className="flex items-center gap-2 mb-4 border-b border-[#121212] pb-2 shrink-0">
              <div className="w-8 h-8 border-2 border-black bg-[#D02020] text-white flex items-center justify-center shrink-0 shadow-[1px_1px_0px_0px_#121212] rounded-none">
                <Brain className="w-4.5 h-4.5" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-black" style={B.labelStyle}>AI Assistant Output</span>
              {loading && (
                <Loader2 className="w-4 h-4 text-[#1040C0] animate-spin ml-auto" />
              )}
            </div>

            <div className="flex-1 overflow-y-auto pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "#121212 #ffffff" }}>
              {loading ? (
                <div className="space-y-3 pt-2">
                  {[80, 65, 90, 50, 75].map((w, i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.15 }}
                      className="h-3.5 bg-gray-200 border border-[#121212] rounded-none"
                      style={{ width: `${w}%` }}
                    />
                  ))}
                </div>
              ) : aiOutput ? (
                <div className="text-sm font-semibold text-gray-800 leading-relaxed whitespace-pre-wrap" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {aiOutput}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Sparkles className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider leading-relaxed" style={B.labelStyle}>
                    Select an AI Action above to analyze or generate writing
                  </p>
                </div>
              )}
            </div>

            {aiOutput && !loading && (
              <div className="flex gap-3 mt-4 border-t border-[#121212] pt-4 shrink-0">
                <button
                  onClick={applyToEditor}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 bg-[#1040C0] text-white border-2 border-black font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_#121212] hover:bg-[#0c30a0] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#121212] transition-all cursor-pointer rounded-none"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  <PenTool className="w-4 h-4 text-white" />
                  Apply to Editor
                </button>
                <button
                  onClick={copyAiOutput}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white border-2 border-black text-[#121212] font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_#121212] hover:bg-gray-50 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#121212] transition-all cursor-pointer rounded-none"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {copied ? <Check className="w-4.5 h-4.5 text-[#1040C0]" /> : <Copy className="w-4.5 h-4.5 text-black" />}
                </button>
              </div>
            )}
          </div>

          {/* Stats widget panel */}
          <div className="bg-white border-2 border-[#121212] p-4 shadow-[4px_4px_0px_0px_#121212] rounded-none shrink-0">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Words Count", value: wordCount },
                { label: "Characters", value: content.length },
                { label: "Lines Count", value: content.split("\n").length },
                { label: "Minutes Read", value: Math.max(1, Math.round(wordCount / 200)) },
              ].map(({ label, value }) => (
                <div key={label} className="text-center p-2 bg-[#F0F0F0] border border-[#121212]">
                  <div className="text-lg font-black text-[#121212]" style={{ fontFamily: "'Outfit', sans-serif" }}>{value}</div>
                  <div className="text-[9px] font-black uppercase tracking-wider text-gray-500 mt-0.5" style={B.labelStyle}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
