"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, ChevronRight, ChevronLeft, RotateCcw,
  ThumbsUp, Minus, ThumbsDown, Sparkles,
  BookOpen, CheckCircle2, Target, Flame, Eye, EyeOff,
} from "lucide-react";
import { B } from "@/lib/bauhaus";

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
  EASY: { label: "Easy", color: "#1040C0", bg: "#1040C015" },
  MEDIUM: { label: "Medium", color: "#F0C020", bg: "#F0C02015" },
  HARD: { label: "Hard", color: "#D02020", bg: "#D0202015" },
};

function FlipCard({ card }: { card: Flashcard }) {
  const [flipped, setFlipped] = useState(false);
  const diff = DIFFICULTY_CONFIG[card.difficulty];

  return (
    <div
      className="relative w-full cursor-pointer"
      style={{ perspective: "1200px", minHeight: "300px" }}
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d", position: "relative", height: "300px" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 bg-white border-4 border-[#121212] flex flex-col items-center justify-center p-8 text-center shadow-[8px_8px_0px_0px_#121212] rounded-none"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="w-12 h-12 border-2 border-[#121212] bg-[#1040C0] text-white flex items-center justify-center mb-6 shadow-[3px_3px_0px_0px_#121212]">
            <Brain className="w-6 h-6" />
          </div>
          <p className="text-[#121212] font-black text-xl leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>{card.front}</p>
          <div className="mt-8 flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-wider" style={B.labelStyle}>
            <EyeOff className="w-4 h-4 text-[#121212]" />
            Click to reveal answer
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 bg-white border-4 border-[#121212] flex flex-col items-center justify-center p-8 text-center shadow-[8px_8px_0px_0px_#121212] rounded-none"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="w-12 h-12 border-2 border-[#121212] bg-[#D02020] text-white flex items-center justify-center mb-4 shadow-[3px_3px_0px_0px_#121212]">
            <Eye className="w-6 h-6" />
          </div>
          <p className="text-[#121212] font-bold text-sm leading-relaxed max-w-lg" style={{ fontFamily: "'Outfit', sans-serif" }}>{card.back}</p>
          <span
            className="mt-6 text-xs font-black uppercase tracking-wider px-3 py-1 border border-[#121212] rounded-none bg-[#F0C020] text-[#121212]"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
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
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-black uppercase tracking-tight text-[#121212]" style={B.displayStyle}>
            Flashcards
          </h1>
          <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mt-1" style={B.labelStyle}>
            {cards.length} cards · Spaced repetition active
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-white border-2 border-[#121212] p-1 shadow-[3px_3px_0px_0px_#121212] rounded-none">
            {(["browse", "review"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-2 font-bold uppercase text-xs tracking-wider transition-all cursor-pointer rounded-none ${
                  mode === m
                    ? "bg-[#1040C0] text-white border border-[#121212]"
                    : "text-[#121212] hover:bg-gray-100"
                }`}
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {m}
              </button>
            ))}
          </div>
          <button
            onClick={generateCards}
            disabled={generating}
            id="generate-flashcards-button"
            className="inline-flex items-center justify-center gap-2 bg-[#D02020] text-white border-2 border-[#121212] font-black uppercase tracking-wider text-xs shadow-[3px_3px_0px_0px_#121212] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#121212] transition-all cursor-pointer rounded-none px-4 py-2"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {generating ? (
              <RotateCcw className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Sparkles className="w-4 h-4 text-white" />
            )}
            AI Generate
          </button>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: BookOpen, label: "Total Deck", value: cards.length, color: B.BLUE },
          { icon: CheckCircle2, label: "Mastered", value: cards.filter((c) => c.masteryScore >= 0.8).length, color: B.RED },
          { icon: Target, label: "Due Today", value: 2, color: B.YELLOW },
          { icon: Flame, label: "Streak", value: "7d", color: B.BLUE },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white border-2 border-[#121212] p-4 flex items-center gap-3 shadow-[3px_3px_0px_0px_#121212] rounded-none">
            <div className="w-10 h-10 border-2 border-[#121212] flex items-center justify-center shadow-[2px_2px_0px_0px_#121212] shrink-0" style={{ background: color }}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-black text-[#121212]" style={{ fontFamily: "'Outfit', sans-serif" }}>{value}</div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-wider" style={B.labelStyle}>{label}</div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Card viewer */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider" style={B.labelStyle}>Card {currentIdx + 1} of {cards.length}</span>
          <div className="flex gap-2">
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                className={`w-2.5 h-2.5 border border-[#121212] transition-all rounded-none cursor-pointer ${
                  i === currentIdx ? "bg-[#D02020] scale-110" : "bg-white"
                }`}
              />
            ))}
          </div>
          <span
            className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border border-[#121212] rounded-none"
            style={{
              background: DIFFICULTY_CONFIG[current.difficulty].bg,
              color: DIFFICULTY_CONFIG[current.difficulty].color,
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            {DIFFICULTY_CONFIG[current.difficulty].label}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
          >
            <FlipCard card={current} />
          </motion.div>
        </AnimatePresence>

        {/* Mastery bar */}
        <div className="bg-white border-2 border-[#121212] p-4 shadow-[4px_4px_0px_0px_#121212] rounded-none">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider" style={B.labelStyle}>Mastery Score</span>
            <span className="text-xs font-extrabold text-[#121212] uppercase" style={{ fontFamily: "'Outfit', sans-serif" }}>{Math.round(current.masteryScore * 100)}%</span>
          </div>
          <div className="h-4 border-2 border-[#121212] bg-[#F0F0F0] overflow-hidden rounded-none">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${current.masteryScore * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full border-r border-[#121212] bg-[#1040C0]"
            />
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          id="prev-card-button"
          onClick={prev}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border-2 border-[#121212] text-[#121212] font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_#121212] hover:bg-gray-50 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#121212] transition-all cursor-pointer rounded-none"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          <ChevronLeft className="w-4 h-4 text-[#121212]" />
          Previous Card
        </button>

        {mode === "review" && (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => rate("hard")}
              id="rate-hard-button"
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#D02020] text-white border-2 border-[#121212] font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_#121212] hover:bg-[#b01a1a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#121212] transition-all cursor-pointer rounded-none"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              <ThumbsDown className="w-4 h-4" /> Hard
            </button>
            <button
              onClick={() => rate("medium")}
              id="rate-medium-button"
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F0C020] text-[#121212] border-2 border-[#121212] font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_#121212] hover:bg-[#d4a818] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#121212] transition-all cursor-pointer rounded-none"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              <Minus className="w-4 h-4" /> Medium
            </button>
            <button
              onClick={() => rate("easy")}
              id="rate-easy-button"
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1040C0] text-white border-2 border-[#121212] font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_#121212] hover:bg-[#0c30a0] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#121212] transition-all cursor-pointer rounded-none"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              <ThumbsUp className="w-4 h-4" /> Easy
            </button>
          </div>
        )}

        <button
          id="next-card-button"
          onClick={next}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border-2 border-[#121212] text-[#121212] font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_#121212] hover:bg-gray-50 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#121212] transition-all cursor-pointer rounded-none ml-auto"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          Next Card
          <ChevronRight className="w-4 h-4 text-[#121212]" />
        </button>
      </motion.div>

      {/* Card list */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
        <h2 className="text-2xl font-black uppercase tracking-tight text-[#121212]" style={B.displayStyle}>All Cards</h2>
        <div className="space-y-3">
          {cards.map((card, i) => {
            const diff = DIFFICULTY_CONFIG[card.difficulty];
            const isSelected = i === currentIdx;
            return (
              <button
                key={card.id}
                onClick={() => setCurrentIdx(i)}
                className={`w-full bg-white border-2 border-[#121212] flex items-center justify-between gap-4 px-5 py-4 text-left shadow-[3px_3px_0px_0px_#121212] rounded-none hover:translate-x-1 transition-all cursor-pointer ${
                  isSelected ? "bg-red-50 border-r-8 border-r-[#D02020]" : ""
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-8 h-8 border-2 border-[#121212] bg-[#1040C0] text-white flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#121212] font-black" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {i + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[#121212] text-sm font-extrabold truncate" style={{ fontFamily: "'Outfit', sans-serif" }}>{card.front}</p>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-0.5" style={B.labelStyle}>{card.concept}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="w-16 h-2 border border-[#121212] bg-gray-100 overflow-hidden rounded-none hidden sm:block">
                    <div className="h-full bg-[#1040C0]" style={{ width: `${card.masteryScore * 100}%` }} />
                  </div>
                  <span
                    className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 border border-[#121212] rounded-none"
                    style={{
                      background: diff.bg,
                      color: diff.color,
                      fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    {diff.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
