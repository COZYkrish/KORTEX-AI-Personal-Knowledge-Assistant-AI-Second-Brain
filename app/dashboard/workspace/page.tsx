"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PenTool, Sparkles, Bold, Italic, List, AlignLeft,
  Brain, Copy, Check, Trash2, Download, Wand2, FileText,
  ChevronDown, MessageSquare, BookOpen, Loader2,
} from "lucide-react";

const AI_ACTIONS = [
  { id: "improve", label: "Improve Writing", icon: Wand2, color: "#7c3aed" },
  { id: "summarize", label: "Summarize", icon: FileText, color: "#00d4ff" },
  { id: "expand", label: "Expand", icon: AlignLeft, color: "#10b981" },
  { id: "bullets", label: "Make Bullet Points", icon: List, color: "#f59e0b" },
  { id: "quiz", label: "Generate Quiz", icon: BookOpen, color: "#ef4444" },
  { id: "chat", label: "Ask AI about this", icon: MessageSquare, color: "#a855f7" },
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
  const [wordCount, setWordCount] = useState(0);
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
    <div className="max-w-7xl mx-auto space-y-4 h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between shrink-0"
      >
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Workspace</h1>
          <p className="text-[#a8b2d8] text-sm mt-0.5">
            {wordCount} words · AI-powered writing canvas
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Templates */}
          <div className="relative">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-sm text-[#a8b2d8] hover:text-white transition-colors"
            >
              <PenTool className="w-4 h-4" />
              Templates
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showTemplates ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {showTemplates && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute top-full right-0 mt-2 w-48 glass-bright rounded-2xl p-2 z-20 shadow-xl"
                >
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.label}
                      onClick={() => { setContent(t.content); setShowTemplates(false); }}
                      className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-[#a8b2d8] hover:bg-[rgba(124,58,237,0.1)] hover:text-white transition-all"
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
            className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-sm text-[#a8b2d8] hover:text-white transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setContent("")}
            className="p-2 glass rounded-xl text-[#64748b] hover:text-[#ef4444] transition-colors"
            title="Clear"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* AI Action Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2 flex-wrap shrink-0"
      >
        <Sparkles className="w-4 h-4 text-[#7c3aed] shrink-0" />
        <span className="text-xs text-[#64748b] mr-1">AI Actions:</span>
        {AI_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => runAI(action.id)}
              disabled={loading}
              id={`ai-action-${action.id}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all disabled:opacity-50"
              style={{
                borderColor: `${action.color}30`,
                background: `${action.color}10`,
                color: action.color,
              }}
            >
              {loading && activeAction === action.id ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Icon className="w-3.5 h-3.5" />
              )}
              {action.label}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Main editor area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
        {/* Editor */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass-bright rounded-2xl overflow-hidden flex flex-col"
        >
          {/* Formatting toolbar */}
          <div className="flex items-center gap-1 px-4 py-2 border-b border-[rgba(124,58,237,0.1)]">
            {[
              { icon: Bold, title: "Bold" },
              { icon: Italic, title: "Italic" },
              { icon: List, title: "List" },
            ].map(({ icon: Icon, title }) => (
              <button
                key={title}
                title={title}
                className="p-1.5 rounded-lg text-[#64748b] hover:text-white hover:bg-[rgba(124,58,237,0.15)] transition-all"
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
            <div className="w-px h-4 bg-[rgba(124,58,237,0.2)] mx-1" />
            <span className="text-xs text-[#4a5568] ml-auto">Markdown supported</span>
          </div>

          <textarea
            ref={textareaRef}
            id="workspace-editor"
            value={content}
            onChange={(e) => handleContent(e.target.value)}
            placeholder="Start writing... Markdown is supported."
            className="flex-1 w-full bg-transparent text-[#c8d0e8] placeholder-[#4a5568] text-sm leading-relaxed resize-none focus:outline-none p-6 font-mono"
            style={{ minHeight: "400px" }}
          />
        </motion.div>

        {/* AI Output Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="flex flex-col gap-4"
        >
          {/* AI Output */}
          <div className="glass-bright rounded-2xl p-5 flex-1 flex flex-col min-h-0">
            <div className="flex items-center gap-2 mb-4 shrink-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#5b21b6] flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-white">AI Output</span>
              {loading && (
                <Loader2 className="w-4 h-4 text-[#7c3aed] animate-spin ml-auto" />
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="space-y-2">
                  {[80, 60, 90, 50, 70].map((w, i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                      className="h-3 rounded-full bg-[rgba(124,58,237,0.2)]"
                      style={{ width: `${w}%` }}
                    />
                  ))}
                </div>
              ) : aiOutput ? (
                <div className="text-sm text-[#c8d0e8] leading-relaxed whitespace-pre-wrap">
                  {aiOutput}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Sparkles className="w-8 h-8 text-[rgba(124,58,237,0.4)] mx-auto mb-3" />
                  <p className="text-sm text-[#4a5568]">
                    Select an AI action above to transform your content
                  </p>
                </div>
              )}
            </div>

            {aiOutput && !loading && (
              <div className="flex gap-2 mt-4 shrink-0">
                <button
                  onClick={applyToEditor}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[rgba(124,58,237,0.2)] border border-[rgba(124,58,237,0.3)] text-[#a78bfa] text-xs font-medium hover:bg-[rgba(124,58,237,0.3)] transition-colors"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  Apply to Editor
                </button>
                <button
                  onClick={copyAiOutput}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl glass text-xs text-[#64748b] hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="glass rounded-2xl p-4 shrink-0">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Words", value: wordCount },
                { label: "Chars", value: content.length },
                { label: "Lines", value: content.split("\n").length },
                { label: "Min read", value: Math.max(1, Math.round(wordCount / 200)) },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className="text-lg font-bold text-white">{value}</div>
                  <div className="text-xs text-[#64748b]">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
