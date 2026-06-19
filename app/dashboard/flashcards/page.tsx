"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, ChevronRight, ChevronLeft, RotateCcw,
  ThumbsUp, Minus, ThumbsDown, Plus, Sparkles,
  BookOpen, CheckCircle2, Target, Flame, Eye, EyeOff,
} from "lucide-react";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  masteryScore: number;
  nextReviewAt: string;
  concept: string;
}

const DEMO_CARDS: Flashcard[] = [
  { id: "1", front: "What is backpropagation?", back: "Backpropagation is an algorithm used to train neural networks by computing gradients of the loss function with respect to the network weights, propagating the error backwards through the network using the chain rule of calculus.", difficulty: "MEDIUM", masteryScore: 0.65, nextReviewAt: "2024-01-16", concept: "Neural Networks" },
  { id: "2", front: "What is the attention mechanism in transformers?", back: "The attention mechanism allows transformers to weigh the importance of different input tokens when computing representations. For each token, it computes Query, Key, and Value matrices, then uses scaled dot-product attention: Attention(Q,K,V) = softmax(QK^T/√d_k)V", difficulty: "HARD", masteryScore: 0.3, nextReviewAt: "2024-01-15", concept: "Transformer" },
  { id: "3", front: "Define gradient descent", back: "Gradient descent is an iterative optimization algorithm that minimizes a loss function by updating parameters in the direction of the negative gradient. The update rule is: θ = θ - α∇J(θ), where α is the learning rate.", difficulty: "EASY", masteryScore: 0.85, nextReviewAt: "2024-01-20", concept: "Optimization" },
  { id: "4", front: "What is dropout regularization?", back: "Dropout is a regularization technique where randomly selected neurons are ignored (dropped) during training. This prevents co-adaptation of neurons and acts as an ensemble of multiple network architectures, reducing overfitting.", difficulty: "MEDIUM", masteryScore: 0.5, nextReviewAt: "2024-01-17", concept: "Regularization" },
];

const DIFFICULTY_CONFIG = {
  EASY: { label: "Easy", color: "#10b981", bg: "rgba(16,185,129,0.15)" },
  MEDIUM: { label: "Medium", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
  HARD: { label: "Hard", color: "#ef4444", bg: "rgba(239,68,68,0.15)" },
};

function FlipCard({ card }: { card: Flashcard }) {
  const [flipped, setFlipped] = useState(false);
  const diff = DIFFICULTY_CONFIG[card.difficulty];

  return (
    <div
      className="relative w-full cursor-pointer"
      style={{ perspective: "1200px", minHeight: "280px" }}
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d", position: "relative", height: "280px" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-8 text-center"
          style={{
            backfaceVisibility: "hidden",
            background: "linear-gradient(135deg, rgba(13,20,64,0.95) 0%, rgba(30,10,60,0.9) 100%)",
            border: "1px solid rgba(124,58,237,0.3)",
            boxShadow: "0 0 40px rgba(124,58,237,0.15)",
          }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#5b21b6] flex items-center justify-center mb-4">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <p className="text-white font-semibold text-lg leading-relaxed">{card.front}</p>
          <div className="mt-6 flex items-center gap-2 text-[#64748b] text-xs">
            <EyeOff className="w-3.5 h-3.5" />
            Click to reveal answer
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-8 text-center"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "linear-gradient(135deg, rgba(10,5,30,0.98) 0%, rgba(13,20,64,0.95) 100%)",
            border: "1px solid rgba(124,58,237,0.5)",
            boxShadow: "0 0 60px rgba(124,58,237,0.25)",
          }}
        >
          <div className="w-10 h-10 rounded-xl bg-[rgba(16,185,129,0.2)] flex items-center justify-center mb-4 border border-[rgba(16,185,129,0.3)]">
            <Eye className="w-5 h-5 text-[#10b981]" />
          </div>
          <p className="text-[#c8d0e8] text-sm leading-relaxed">{card.back}</p>
          <span className="mt-4 text-xs px-2 py-1 rounded-full" style={{ background: diff.bg, color: diff.color }}>
            {card.concept}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export default function FlashcardsPage() {
  const [cards] = useState<Flashcard[]>(DEMO_CARDS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [mode, setMode] = useState<"browse" | "review">("browse");
  const [reviewedCount, setReviewedCount] = useState(0);
  const [generating, setGenerating] = useState(false);

  const current = cards[currentIdx];

  const next = () => setCurrentIdx((i) => (i + 1) % cards.length);
  const prev = () => setCurrentIdx((i) => (i - 1 + cards.length) % cards.length);

  const rate = (rating: "easy" | "medium" | "hard") => {
    setReviewedCount((c) => c + 1);
    next();
  };

  const generateCards = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 2000));
    setGenerating(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Flashcards</h1>
          <p className="text-[#a8b2d8] text-sm mt-0.5">{cards.length} cards · Spaced repetition enabled</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 glass rounded-xl p-1">
            {(["browse", "review"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${mode === m ? "bg-[rgba(124,58,237,0.3)] text-white" : "text-[#64748b] hover:text-white"}`}
              >
                {m}
              </button>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={generateCards}
            disabled={generating}
            id="generate-flashcards-button"
            className="btn-primary flex items-center gap-2"
          >
            {generating ? (
              <RotateCcw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            AI Generate
          </motion.button>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-4 gap-4">
        {[
          { icon: BookOpen, label: "Total", value: cards.length, color: "#7c3aed" },
          { icon: CheckCircle2, label: "Mastered", value: cards.filter((c) => c.masteryScore >= 0.8).length, color: "#10b981" },
          { icon: Target, label: "Due Today", value: 2, color: "#f59e0b" },
          { icon: Flame, label: "Streak", value: "7d", color: "#ef4444" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="glass p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div>
              <div className="text-xl font-bold text-white">{value}</div>
              <div className="text-xs text-[#64748b]">{label}</div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Card viewer */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#64748b]">Card {currentIdx + 1} of {cards.length}</span>
          <div className="flex gap-2">
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                className="w-2 h-2 rounded-full transition-all"
                style={{ background: i === currentIdx ? "#7c3aed" : "rgba(124,58,237,0.2)" }}
              />
            ))}
          </div>
          <span
            className="text-xs px-2 py-1 rounded-full font-medium"
            style={{
              background: DIFFICULTY_CONFIG[current.difficulty].bg,
              color: DIFFICULTY_CONFIG[current.difficulty].color,
            }}
          >
            {DIFFICULTY_CONFIG[current.difficulty].label}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
          >
            <FlipCard card={current} />
          </motion.div>
        </AnimatePresence>

        {/* Mastery bar */}
        <div className="glass p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#64748b]">Mastery Score</span>
            <span className="text-xs font-medium text-white">{Math.round(current.masteryScore * 100)}%</span>
          </div>
          <div className="h-2 rounded-full bg-[rgba(124,58,237,0.15)] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${current.masteryScore * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-[#7c3aed] to-[#10b981]"
            />
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-center justify-between">
        <button
          id="prev-card-button"
          onClick={prev}
          className="flex items-center gap-2 px-5 py-2.5 glass rounded-xl text-[#a8b2d8] hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        {mode === "review" && (
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => rate("hard")}
              id="rate-hard-button"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all"
              style={{ background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.3)", color: "#ef4444" }}
            >
              <ThumbsDown className="w-4 h-4" /> Hard
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => rate("medium")}
              id="rate-medium-button"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all"
              style={{ background: "rgba(245,158,11,0.1)", borderColor: "rgba(245,158,11,0.3)", color: "#f59e0b" }}
            >
              <Minus className="w-4 h-4" /> Medium
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => rate("easy")}
              id="rate-easy-button"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all"
              style={{ background: "rgba(16,185,129,0.1)", borderColor: "rgba(16,185,129,0.3)", color: "#10b981" }}
            >
              <ThumbsUp className="w-4 h-4" /> Easy
            </motion.button>
          </div>
        )}

        <button
          id="next-card-button"
          onClick={next}
          className="flex items-center gap-2 px-5 py-2.5 glass rounded-xl text-[#a8b2d8] hover:text-white transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>

      {/* Card list */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-3">
        <h2 className="font-semibold text-white">All Cards</h2>
        {cards.map((card, i) => {
          const diff = DIFFICULTY_CONFIG[card.difficulty];
          return (
            <motion.button
              key={card.id}
              onClick={() => setCurrentIdx(i)}
              whileHover={{ x: 4 }}
              className={`w-full glass flex items-center gap-4 px-5 py-4 text-left transition-all ${i === currentIdx ? "border-[rgba(124,58,237,0.5)]" : ""}`}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-[#7c3aed] to-[#5b21b6]">
                <span className="text-white text-xs font-bold">{i + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{card.front}</p>
                <p className="text-[#64748b] text-xs mt-0.5">{card.concept}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-16 h-1.5 rounded-full bg-[rgba(124,58,237,0.15)] overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#7c3aed] to-[#10b981]" style={{ width: `${card.masteryScore * 100}%` }} />
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: diff.bg, color: diff.color }}>
                  {diff.label}
                </span>
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
