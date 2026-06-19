"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Map, Sparkles, CheckCircle2, Circle, Clock,
  Loader2, ChevronDown, Brain,
  Target, Lock, Play, Trophy, Zap, X
} from "lucide-react";
import { B } from "@/lib/bauhaus";

interface PathNode {
  id: string;
  title: string;
  description: string;
  status: "COMPLETED" | "IN_PROGRESS" | "PENDING" | "LOCKED";
  order: number;
  estimatedMinutes: number;
  resources?: string[];
}

interface LearningPath {
  id: string;
  topic: string;
  description: string;
  masteryScore: number;
  nodes: PathNode[];
}

const DEMO_PATHS: LearningPath[] = [
  {
    id: "1",
    topic: "Deep Learning Fundamentals",
    description: "A structured journey through neural networks, from basic perceptrons to advanced transformer architectures.",
    masteryScore: 0.45,
    nodes: [
      { id: "n1", title: "Introduction to Neural Networks", description: "Learn the biological inspiration and mathematical foundation of artificial neural networks.", status: "COMPLETED", order: 1, estimatedMinutes: 30, resources: ["ML Fundamentals Ch. 1", "Neural Networks Explained"] },
      { id: "n2", title: "Activation Functions & Forward Pass", description: "Understand ReLU, Sigmoid, Tanh and how information flows through layers.", status: "COMPLETED", order: 2, estimatedMinutes: 25, resources: ["ML Fundamentals Ch. 2"] },
      { id: "n3", title: "Backpropagation & Gradient Descent", description: "Master the learning algorithm that makes deep learning possible.", status: "IN_PROGRESS", order: 3, estimatedMinutes: 45, resources: ["ML Fundamentals Ch. 3", "PyTorch Book Ch. 2"] },
      { id: "n4", title: "Convolutional Neural Networks", description: "Explore how CNNs revolutionized computer vision with spatial feature extraction.", status: "PENDING", order: 4, estimatedMinutes: 60, resources: ["Deep Learning Ch. 6"] },
      { id: "n5", title: "Recurrent Networks & LSTMs", description: "Sequence modeling with memory — the foundation for NLP.", status: "LOCKED", order: 5, estimatedMinutes: 50 },
      { id: "n6", title: "Attention & Transformers", description: "The breakthrough architecture behind GPT, BERT, and modern AI.", status: "LOCKED", order: 6, estimatedMinutes: 75 },
    ],
  },
  {
    id: "2",
    topic: "Machine Learning Optimization",
    description: "From gradient descent variants to advanced adaptive learning rate methods.",
    masteryScore: 0.2,
    nodes: [
      { id: "o1", title: "Gradient Descent Variants", description: "SGD, Mini-batch GD, and why batching matters.", status: "COMPLETED", order: 1, estimatedMinutes: 20 },
      { id: "o2", title: "Momentum & Nesterov", description: "Accelerate training with physics-inspired methods.", status: "IN_PROGRESS", order: 2, estimatedMinutes: 25 },
      { id: "o3", title: "Adam, AdaGrad, RMSProp", description: "Adaptive learning rates for faster convergence.", status: "LOCKED", order: 3, estimatedMinutes: 35 },
    ],
  },
];

const NODE_CONFIG = {
  COMPLETED: { icon: CheckCircle2, color: "#1040C0", bg: "#1040C015", label: "Completed" },
  IN_PROGRESS: { icon: Play, color: "#D02020", bg: "#D0202020", label: "In Progress" },
  PENDING: { icon: Circle, color: "#121212", bg: "#12121210", label: "Not Started" },
  LOCKED: { icon: Lock, color: "#999999", bg: "#99999910", label: "Locked" },
};

function PathNodeCard({ node, isLast }: { node: PathNode; isLast: boolean }) {
  const [open, setOpen] = useState(node.status === "IN_PROGRESS");
  const config = NODE_CONFIG[node.status];
  const Icon = config.icon;

  return (
    <div className="relative">
      {/* Connector line */}
      {!isLast && (
        <div
          className="absolute left-[24px] top-12 bottom-0 w-1 bg-[#121212] z-0"
        />
      )}

      <div className="relative z-10">
        <div
          className={`bg-white border-2 border-[#121212] shadow-[3px_3px_0px_0px_#121212] rounded-none overflow-hidden transition-all ${
            node.status === "LOCKED" ? "opacity-50 select-none cursor-not-allowed" : "cursor-pointer hover:translate-x-1"
          }`}
          onClick={() => node.status !== "LOCKED" && setOpen(!open)}
        >
          <div className="flex items-start gap-4 p-5">
            {/* Node icon */}
            <div
              className="w-10 h-10 border-2 border-[#121212] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#121212] rounded-none"
              style={{ background: config.color, color: "#ffffff" }}
            >
              <Icon className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[#121212] font-extrabold text-sm uppercase tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>{node.title}</span>
                <span
                  className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 border border-[#121212] rounded-none"
                  style={{ background: config.bg, color: config.color, fontFamily: "'Outfit', sans-serif" }}
                >
                  {config.label}
                </span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1 ml-auto shrink-0" style={B.labelStyle}>
                  <Clock className="w-3.5 h-3.5 text-[#121212]" />
                  {node.estimatedMinutes} min
                </span>
              </div>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mt-1.5 line-clamp-1" style={B.labelStyle}>{node.description}</p>
            </div>

            {node.status !== "LOCKED" && (
              <ChevronDown
                className={`w-4 h-4 text-[#121212] shrink-0 mt-1 transition-transform ${open ? "rotate-180" : ""}`}
              />
            )}
          </div>

          <AnimatePresence>
            {open && node.status !== "LOCKED" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t-2 border-dashed border-[#121212]"
              >
                <div className="px-5 pb-5 pt-4 space-y-4">
                  <p className="text-sm font-semibold text-gray-700 leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>{node.description}</p>
                  {node.resources && node.resources.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2" style={B.labelStyle}>Source documents:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {node.resources.map((r) => (
                          <span key={r} className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-white border border-[#121212] text-[#121212] rounded-none" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {node.status === "IN_PROGRESS" && (
                    <button className="inline-flex items-center justify-center gap-2 bg-[#D02020] text-white border-2 border-[#121212] font-black uppercase text-xs tracking-wider shadow-[2px_2px_0px_0px_#121212] hover:bg-[#b01a1a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#121212] rounded-none px-4 py-2 mt-2 cursor-pointer transition-all">
                      <Zap className="w-4 h-4 text-white" />
                      Continue Learning
                    </button>
                  )}
                  {node.status === "PENDING" && (
                    <button className="inline-flex items-center justify-center gap-2 bg-[#1040C0] text-white border-2 border-[#121212] font-black uppercase text-xs tracking-wider shadow-[2px_2px_0px_0px_#121212] hover:bg-[#0c30a0] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#121212] rounded-none px-4 py-2 mt-2 cursor-pointer transition-all">
                      <Play className="w-4 h-4 text-white" />
                      Start Module
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function LearningPathsPage() {
  const [paths] = useState<LearningPath[]>(DEMO_PATHS);
  const [selectedPath, setSelectedPath] = useState<LearningPath>(DEMO_PATHS[0]);
  const [generating, setGenerating] = useState(false);
  const [topic, setTopic] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const completedNodes = selectedPath.nodes.filter((n) => n.status === "COMPLETED").length;
  const totalMinutes = selectedPath.nodes.reduce((sum, n) => sum + n.estimatedMinutes, 0);

  const createPath = async () => {
    if (!topic.trim()) return;
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 2500));
    setGenerating(false);
    setShowCreate(false);
    setTopic("");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-black uppercase tracking-tight text-[#121212]" style={B.displayStyle}>
            Learning Paths
          </h1>
          <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mt-1" style={B.labelStyle}>
            AI curriculum paths from your knowledge assistant
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          id="create-learning-path-button"
          className="inline-flex items-center justify-center gap-2 bg-[#D02020] text-white border-2 border-[#121212] font-black uppercase tracking-wider text-xs shadow-[3px_3px_0px_0px_#121212] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#121212] transition-all cursor-pointer rounded-none px-4 py-2.5"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          <Sparkles className="w-4 h-4 text-white" />
          Create Path
        </button>
      </motion.div>

      {/* Create Path Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm"
            onClick={() => !generating && setShowCreate(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg bg-[#F0F0F0] border-4 border-[#121212] p-8 relative shadow-[8px_8px_0px_0px_#121212] rounded-none"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowCreate(false)}
                className="absolute top-4 right-4 p-1.5 border-2 border-[#121212] bg-white text-[#121212] hover:bg-[#D02020] hover:text-white transition-all cursor-pointer rounded-none shadow-[2px_2px_0px_0px_#121212]"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 border-2 border-[#121212] bg-[#1040C0] text-white flex items-center justify-center shadow-[2px_2px_0px_0px_#121212]">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-black uppercase tracking-tight text-[#121212]" style={B.displayStyle}>Create Path</h2>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-0.5" style={B.labelStyle}>AI curriculum compiler</p>
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-gray-500 block mb-2" style={B.labelStyle}>What do you want to learn?</label>
                  <input
                    id="learning-path-topic-input"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && createPath()}
                    placeholder="e.g. Transformer architectures, Optimization algorithms..."
                    className="w-full px-4 py-3 border-2 border-[#121212] bg-white text-[#121212] placeholder-gray-400 text-sm font-semibold rounded-none focus:outline-none focus:bg-gray-50 shadow-[3px_3px_0px_0px_#121212]"
                    autoFocus
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  />
                </div>
                <p className="text-xs font-semibold text-gray-600 leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  Kortex AI will analyze your workspace documents to construct a personalized syllabus complete with learning nodes, references, and milestones.
                </p>
                <div className="flex gap-3 border-t-2 border-dashed border-[#121212] pt-4">
                  <button
                    onClick={() => setShowCreate(false)}
                    className="flex-1 py-3 bg-white border-2 border-[#121212] text-[#121212] font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_#121212] hover:bg-gray-50 active:translate-x-[1px] active:translate-y-[1px] rounded-none cursor-pointer"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createPath}
                    disabled={!topic.trim() || generating}
                    id="generate-learning-path-button"
                    className="flex-1 py-3 bg-[#D02020] text-white border-2 border-[#121212] font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_#121212] hover:bg-[#b01a1a] active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed rounded-none cursor-pointer"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {generating ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        Generating...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4 text-white" />
                        Generate
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Path selector + content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar — path list */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 }}
          className="lg:col-span-1 space-y-4"
        >
          <p className="text-xs font-black uppercase tracking-wider text-gray-500" style={B.labelStyle}>Your Paths</p>
          <div className="space-y-3">
            {paths.map((path) => {
              const isSelected = selectedPath.id === path.id;
              return (
                <button
                  key={path.id}
                  onClick={() => setSelectedPath(path)}
                  className={`w-full text-left p-4 bg-white border-2 border-[#121212] shadow-[3px_3px_0px_0px_#121212] rounded-none hover:translate-x-1 transition-all cursor-pointer ${
                    isSelected ? "bg-red-50 border-r-8 border-r-[#D02020]" : ""
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Map className="w-4.5 h-4.5 text-[#1040C0] shrink-0" />
                    <span className="text-sm font-extrabold text-[#121212] truncate" style={{ fontFamily: "'Outfit', sans-serif" }}>{path.topic}</span>
                  </div>
                  <div className="h-2.5 border border-[#121212] bg-gray-150 rounded-none overflow-hidden mb-2">
                    <div
                      className="h-full bg-[#1040C0]"
                      style={{ width: `${path.masteryScore * 100}%` }}
                    />
                  </div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider" style={B.labelStyle}>{Math.round(path.masteryScore * 100)}% complete</p>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Main — path detail */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3 space-y-6"
        >
          {/* Path stats summary */}
          <div className="bg-white border-2 border-[#121212] p-6 shadow-[5px_5px_0px_0px_#121212] rounded-none">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="font-display text-2xl font-black uppercase tracking-tight text-[#121212]" style={B.displayStyle}>{selectedPath.topic}</h2>
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mt-1" style={B.labelStyle}>{selectedPath.description}</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F0C020] border-2 border-[#121212] text-[#121212] font-black uppercase text-xs tracking-wider shadow-[2px_2px_0px_0px_#121212] shrink-0 self-start" style={{ fontFamily: "'Outfit', sans-serif" }}>
                <Trophy className="w-3.5 h-3.5" />
                <span>{Math.round(selectedPath.masteryScore * 100)}% Mastery</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
              {[
                { icon: CheckCircle2, label: "Completed Modules", value: `${completedNodes}/${selectedPath.nodes.length}`, color: B.BLUE },
                { icon: Clock, label: "Est. Time Duration", value: `${totalMinutes} min`, color: B.RED },
                { icon: Target, label: "Calculated Mastery", value: `${Math.round(selectedPath.masteryScore * 100)}%`, color: B.YELLOW },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="text-center bg-[#F0F0F0] border-2 border-[#121212] rounded-none p-4 shadow-[3px_3px_0px_0px_#121212]">
                  <Icon className="w-5 h-5 mx-auto mb-1.5" style={{ color }} />
                  <div className="text-[#121212] font-black text-lg" style={{ fontFamily: "'Outfit', sans-serif" }}>{value}</div>
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-wider" style={B.labelStyle}>{label}</div>
                </div>
              ))}
            </div>

            {/* Overall progress bar */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider mb-2" style={B.labelStyle}>
                <span>Overall Journey Progress</span>
                <span className="text-[#121212] font-black">{Math.round(selectedPath.masteryScore * 100)}%</span>
              </div>
              <div className="h-4 border-2 border-[#121212] bg-[#F0F0F0] overflow-hidden rounded-none">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${selectedPath.masteryScore * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full border-r border-[#121212] bg-[#1040C0]"
                />
              </div>
            </div>
          </div>

          {/* Nodes tree list */}
          <div className="space-y-4">
            {selectedPath.nodes.map((node, i) => (
              <PathNodeCard key={node.id} node={node} isLast={i === selectedPath.nodes.length - 1} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
