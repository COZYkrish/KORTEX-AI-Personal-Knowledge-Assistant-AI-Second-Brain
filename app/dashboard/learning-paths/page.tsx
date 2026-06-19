"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Map, Sparkles, CheckCircle2, Circle, Clock,
  Loader2, ChevronRight, ChevronDown, Brain,
  Target, Lock, Play, Trophy, Zap,
} from "lucide-react";

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
  COMPLETED: { icon: CheckCircle2, color: "#10b981", bg: "rgba(16,185,129,0.15)", label: "Completed" },
  IN_PROGRESS: { icon: Play, color: "#7c3aed", bg: "rgba(124,58,237,0.2)", label: "In Progress" },
  PENDING: { icon: Circle, color: "#64748b", bg: "rgba(100,116,139,0.1)", label: "Not Started" },
  LOCKED: { icon: Lock, color: "#4a5568", bg: "rgba(74,85,104,0.1)", label: "Locked" },
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
          className="absolute left-[19px] top-12 bottom-0 w-0.5 z-0"
          style={{
            background: node.status === "COMPLETED"
              ? "linear-gradient(to bottom, #10b981, rgba(16,185,129,0.2))"
              : "rgba(124,58,237,0.15)",
          }}
        />
      )}

      <div className="relative z-10">
        <motion.div
          whileHover={node.status !== "LOCKED" ? { x: 2 } : {}}
          className={`glass rounded-2xl overflow-hidden transition-all ${node.status === "LOCKED" ? "opacity-50" : "cursor-pointer"}`}
          onClick={() => node.status !== "LOCKED" && setOpen(!open)}
        >
          <div className="flex items-start gap-4 p-5">
            {/* Node icon */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: config.bg }}
            >
              <Icon className="w-5 h-5" style={{ color: config.color }} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white font-semibold text-sm">{node.title}</span>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0"
                  style={{ background: config.bg, color: config.color }}
                >
                  {config.label}
                </span>
                <span className="text-xs text-[#64748b] flex items-center gap-1 ml-auto shrink-0">
                  <Clock className="w-3 h-3" />
                  {node.estimatedMinutes} min
                </span>
              </div>
              <p className="text-sm text-[#a8b2d8] mt-1 line-clamp-1">{node.description}</p>
            </div>

            {node.status !== "LOCKED" && (
              <ChevronDown
                className={`w-4 h-4 text-[#64748b] shrink-0 mt-1 transition-transform ${open ? "rotate-180" : ""}`}
              />
            )}
          </div>

          <AnimatePresence>
            {open && node.status !== "LOCKED" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-[rgba(124,58,237,0.1)]"
              >
                <div className="px-5 pb-5 pt-4 space-y-3">
                  <p className="text-sm text-[#c8d0e8] leading-relaxed">{node.description}</p>
                  {node.resources && node.resources.length > 0 && (
                    <div>
                      <p className="text-xs text-[#64748b] mb-2">Source documents:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {node.resources.map((r) => (
                          <span key={r} className="text-xs px-2.5 py-1 rounded-lg bg-[rgba(124,58,237,0.12)] text-[#a78bfa] border border-[rgba(124,58,237,0.2)]">
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {node.status === "IN_PROGRESS" && (
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl btn-primary text-sm mt-2">
                      <Zap className="w-4 h-4" />
                      Continue Learning
                    </button>
                  )}
                  {node.status === "PENDING" && (
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[rgba(124,58,237,0.2)] border border-[rgba(124,58,237,0.3)] text-[#a78bfa] text-sm hover:bg-[rgba(124,58,237,0.3)] transition-colors">
                      <Play className="w-4 h-4" />
                      Start Module
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
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
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Learning Paths</h1>
          <p className="text-[#a8b2d8] text-sm mt-0.5">AI-generated roadmaps from your knowledge base</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowCreate(true)}
          id="create-learning-path-button"
          className="btn-primary flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Create Path
        </motion.button>
      </motion.div>

      {/* Create Path Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
            onClick={() => !generating && setShowCreate(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg glass-bright rounded-2xl p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#5b21b6] flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-white">Create Learning Path</h2>
                  <p className="text-xs text-[#64748b]">AI will generate a structured curriculum from your documents</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-[#a8b2d8] mb-2 block">What do you want to learn?</label>
                  <input
                    id="learning-path-topic-input"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && createPath()}
                    placeholder="e.g. Transformer architectures, Optimization algorithms..."
                    className="w-full px-4 py-3 rounded-xl bg-[rgba(13,20,64,0.6)] border border-[rgba(124,58,237,0.3)] text-white placeholder-[#4a5568] text-sm focus:outline-none focus:border-[rgba(124,58,237,0.6)] transition-colors"
                    autoFocus
                  />
                </div>
                <p className="text-xs text-[#64748b]">
                  Kortex AI will analyze your uploaded documents and create a personalized learning roadmap with milestones, resources, and estimated durations.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCreate(false)}
                    className="flex-1 py-3 glass rounded-xl text-[#a8b2d8] hover:text-white text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={createPath}
                    disabled={!topic.trim() || generating}
                    id="generate-learning-path-button"
                    className="flex-1 btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Path selector + content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar — path list */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1 space-y-2"
        >
          <p className="text-xs text-[#64748b] font-medium uppercase tracking-wider mb-3">Your Paths</p>
          {paths.map((path) => (
            <motion.button
              key={path.id}
              whileHover={{ x: 2 }}
              onClick={() => setSelectedPath(path)}
              className={`w-full text-left p-4 glass rounded-xl transition-all ${selectedPath.id === path.id ? "border-[rgba(124,58,237,0.5)] bg-[rgba(124,58,237,0.1)]" : ""}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Map className="w-4 h-4 text-[#7c3aed] shrink-0" />
                <span className="text-sm font-medium text-white truncate">{path.topic}</span>
              </div>
              <div className="h-1.5 rounded-full bg-[rgba(124,58,237,0.15)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#7c3aed] to-[#10b981]"
                  style={{ width: `${path.masteryScore * 100}%` }}
                />
              </div>
              <p className="text-xs text-[#64748b] mt-1">{Math.round(path.masteryScore * 100)}% complete</p>
            </motion.button>
          ))}
        </motion.div>

        {/* Main — path detail */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-3 space-y-4"
        >
          {/* Path stats */}
          <div className="glass p-5 rounded-2xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-display text-xl font-bold text-white">{selectedPath.topic}</h2>
                <p className="text-sm text-[#a8b2d8] mt-1">{selectedPath.description}</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(124,58,237,0.15)] border border-[rgba(124,58,237,0.3)]">
                <Trophy className="w-3.5 h-3.5 text-[#f59e0b]" />
                <span className="text-xs font-medium text-white">{Math.round(selectedPath.masteryScore * 100)}%</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: CheckCircle2, label: "Completed", value: `${completedNodes}/${selectedPath.nodes.length}`, color: "#10b981" },
                { icon: Clock, label: "Total time", value: `${totalMinutes}m`, color: "#00d4ff" },
                { icon: Target, label: "Mastery", value: `${Math.round(selectedPath.masteryScore * 100)}%`, color: "#7c3aed" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="text-center p-3 rounded-xl bg-[rgba(10,15,46,0.4)]">
                  <Icon className="w-4 h-4 mx-auto mb-1" style={{ color }} />
                  <div className="text-white font-bold text-lg">{value}</div>
                  <div className="text-xs text-[#64748b]">{label}</div>
                </div>
              ))}
            </div>
            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-[#64748b] mb-1">
                <span>Overall Progress</span>
                <span>{Math.round(selectedPath.masteryScore * 100)}%</span>
              </div>
              <div className="h-2 rounded-full bg-[rgba(124,58,237,0.15)] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${selectedPath.masteryScore * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-[#7c3aed] to-[#10b981]"
                />
              </div>
            </div>
          </div>

          {/* Nodes */}
          <div className="space-y-3">
            {selectedPath.nodes.map((node, i) => (
              <PathNodeCard key={node.id} node={node} isLast={i === selectedPath.nodes.length - 1} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
