"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList, Sparkles, CheckCircle2, XCircle,
  ChevronRight, RotateCcw, Trophy, Target, Clock,
  Loader2, AlertCircle,
} from "lucide-react";

interface Question {
  id: string;
  type: "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER";
  content: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  userAnswer?: string;
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  completed: boolean;
  score?: number;
}

const DEMO_QUIZ: Quiz = {
  id: "1",
  title: "Machine Learning Fundamentals",
  completed: false,
  questions: [
    {
      id: "q1",
      type: "MCQ",
      content: "Which optimization algorithm is most commonly used for training deep neural networks?",
      options: ["Newton's Method", "Gradient Descent", "Genetic Algorithms", "Linear Programming"],
      correctAnswer: "Gradient Descent",
      explanation: "Gradient descent (and its variants like Adam, SGD) is the primary optimization algorithm used in deep learning because it efficiently computes parameter updates using backpropagation.",
    },
    {
      id: "q2",
      type: "TRUE_FALSE",
      content: "Dropout regularization is applied during inference (testing) time to improve model accuracy.",
      options: ["True", "False"],
      correctAnswer: "False",
      explanation: "Dropout is only applied during training. During inference, all neurons are active and their outputs are scaled by the dropout probability to account for the larger network.",
    },
    {
      id: "q3",
      type: "MCQ",
      content: "What does the 'attention' mechanism in transformers primarily allow the model to do?",
      options: [
        "Process sequences in parallel",
        "Weigh the importance of different input positions",
        "Reduce model parameters",
        "Speed up inference",
      ],
      correctAnswer: "Weigh the importance of different input positions",
      explanation: "The attention mechanism computes a weighted sum of value vectors, where weights (attention scores) reflect how relevant each position is to the current query.",
    },
    {
      id: "q4",
      type: "TRUE_FALSE",
      content: "Batch normalization always improves model performance regardless of architecture.",
      options: ["True", "False"],
      correctAnswer: "False",
      explanation: "While batch normalization is beneficial in many architectures, it can hurt performance in recurrent networks and very small batch sizes. Its effectiveness depends on the specific architecture and task.",
    },
  ],
};

function OptionButton({
  option, selected, correct, revealed, onClick
}: {
  option: string;
  selected: boolean;
  correct: boolean;
  revealed: boolean;
  onClick: () => void;
}) {
  const getBg = () => {
    if (!revealed) return selected ? "rgba(124,58,237,0.25)" : "rgba(13,20,64,0.5)";
    if (correct) return "rgba(16,185,129,0.2)";
    if (selected && !correct) return "rgba(239,68,68,0.2)";
    return "rgba(13,20,64,0.3)";
  };
  const getBorder = () => {
    if (!revealed) return selected ? "rgba(124,58,237,0.6)" : "rgba(124,58,237,0.15)";
    if (correct) return "rgba(16,185,129,0.5)";
    if (selected && !correct) return "rgba(239,68,68,0.5)";
    return "rgba(124,58,237,0.1)";
  };

  return (
    <motion.button
      whileHover={!revealed ? { x: 4 } : {}}
      whileTap={!revealed ? { scale: 0.98 } : {}}
      onClick={!revealed ? onClick : undefined}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all text-sm"
      style={{ background: getBg(), border: `1px solid ${getBorder()}` }}
    >
      {revealed && correct && <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />}
      {revealed && selected && !correct && <XCircle className="w-4 h-4 text-[#ef4444] shrink-0" />}
      {(!revealed || (!correct && !selected)) && (
        <div className={`w-4 h-4 rounded-full border shrink-0 transition-colors ${selected ? "border-[#7c3aed] bg-[#7c3aed]" : "border-[#64748b]"}`} />
      )}
      <span className={revealed && correct ? "text-[#10b981] font-medium" : revealed && selected && !correct ? "text-[#ef4444]" : "text-[#c8d0e8]"}>
        {option}
      </span>
    </motion.button>
  );
}

export default function QuizzesPage() {
  const [quiz] = useState<Quiz>(DEMO_QUIZ);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [done, setDone] = useState(false);
  const [generating, setGenerating] = useState(false);

  const q = quiz.questions[currentQ];
  const isAnswered = !!answers[q.id];
  const isRevealed = !!revealed[q.id];

  const select = (option: string) => {
    if (isRevealed) return;
    setAnswers((prev) => ({ ...prev, [q.id]: option }));
  };

  const check = () => {
    setRevealed((prev) => ({ ...prev, [q.id]: true }));
  };

  const next = () => {
    if (currentQ < quiz.questions.length - 1) {
      setCurrentQ((i) => i + 1);
    } else {
      setDone(true);
    }
  };

  const score = quiz.questions.filter((q) => answers[q.id] === q.correctAnswer).length;
  const pct = Math.round((score / quiz.questions.length) * 100);

  const generate = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 2000));
    setGenerating(false);
  };

  if (done) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-bright rounded-3xl p-12 text-center"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.15), transparent 60%), rgba(13,20,64,0.8)" }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
            style={{ background: pct >= 80 ? "linear-gradient(135deg, #10b981, #059669)" : pct >= 60 ? "linear-gradient(135deg, #f59e0b, #d97706)" : "linear-gradient(135deg, #ef4444, #dc2626)" }}
          >
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="font-display text-3xl font-bold text-white mb-2">Quiz Complete!</h2>
          <p className="text-[#a8b2d8] mb-8">{pct >= 80 ? "Excellent work! 🎉" : pct >= 60 ? "Good effort! Keep practising." : "Keep studying — you'll get there!"}</p>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Score", value: `${pct}%`, color: pct >= 80 ? "#10b981" : pct >= 60 ? "#f59e0b" : "#ef4444" },
              { label: "Correct", value: `${score}/${quiz.questions.length}`, color: "#7c3aed" },
              { label: "Time", value: "4:32", color: "#00d4ff" },
            ].map(({ label, value, color }) => (
              <div key={label} className="glass p-4 rounded-2xl">
                <div className="text-2xl font-bold" style={{ color }}>{value}</div>
                <div className="text-xs text-[#64748b] mt-1">{label}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 justify-center">
            <button
              onClick={() => { setDone(false); setCurrentQ(0); setAnswers({}); setRevealed({}); }}
              className="flex items-center gap-2 px-6 py-3 glass rounded-xl text-[#a8b2d8] hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Retry
            </button>
            <button className="btn-primary flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Generate Flashcards
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Quizzes</h1>
          <p className="text-[#a8b2d8] text-sm mt-0.5">AI-generated from your documents</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={generate}
          disabled={generating}
          id="generate-quiz-button"
          className="btn-primary flex items-center gap-2"
        >
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Generate Quiz
        </motion.button>
      </motion.div>

      {/* Progress */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass p-4 rounded-2xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#7c3aed]" />
            <span className="text-sm text-[#a8b2d8]">{quiz.title}</span>
          </div>
          <span className="text-sm text-white font-medium">
            {currentQ + 1} / {quiz.questions.length}
          </span>
        </div>
        <div className="h-2 rounded-full bg-[rgba(124,58,237,0.15)] overflow-hidden">
          <motion.div
            animate={{ width: `${((currentQ + (isRevealed ? 1 : 0)) / quiz.questions.length) * 100}%` }}
            transition={{ duration: 0.4 }}
            className="h-full rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7]"
          />
        </div>
        <div className="flex gap-1.5 mt-3">
          {quiz.questions.map((question, i) => {
            const isCorrect = answers[question.id] === question.correctAnswer;
            const isWrong = answers[question.id] && answers[question.id] !== question.correctAnswer;
            return (
              <div
                key={question.id}
                className="h-1.5 flex-1 rounded-full transition-all"
                style={{
                  background: revealed[question.id]
                    ? isCorrect ? "#10b981" : "#ef4444"
                    : i === currentQ ? "#7c3aed" : "rgba(124,58,237,0.2)",
                }}
              />
            );
          })}
        </div>
      </motion.div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="glass-bright rounded-2xl p-8 space-y-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#5b21b6] flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">Q{currentQ + 1}</span>
            </div>
            <div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[rgba(124,58,237,0.15)] text-[#a78bfa] mb-2 inline-block">
                {q.type.replace("_", " ")}
              </span>
              <p className="text-white font-semibold text-lg leading-relaxed">{q.content}</p>
            </div>
          </div>

          {q.options && (
            <div className="space-y-3">
              {q.options.map((option) => (
                <OptionButton
                  key={option}
                  option={option}
                  selected={answers[q.id] === option}
                  correct={q.correctAnswer === option}
                  revealed={isRevealed}
                  onClick={() => select(option)}
                />
              ))}
            </div>
          )}

          {/* Explanation */}
          <AnimatePresence>
            {isRevealed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-xl p-4 border flex gap-3"
                style={{
                  background: answers[q.id] === q.correctAnswer ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
                  borderColor: answers[q.id] === q.correctAnswer ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
                }}
              >
                {answers[q.id] === q.correctAnswer
                  ? <CheckCircle2 className="w-5 h-5 text-[#10b981] shrink-0 mt-0.5" />
                  : <AlertCircle className="w-5 h-5 text-[#ef4444] shrink-0 mt-0.5" />}
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: answers[q.id] === q.correctAnswer ? "#10b981" : "#ef4444" }}>
                    {answers[q.id] === q.correctAnswer ? "Correct!" : `Incorrect — correct answer: ${q.correctAnswer}`}
                  </p>
                  <p className="text-sm text-[#a8b2d8]">{q.explanation}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-xs text-[#64748b]">
              <Clock className="w-3.5 h-3.5" />
              Take your time
            </div>
            <div className="flex gap-3">
              {isAnswered && !isRevealed && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={check}
                  id="check-answer-button"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[rgba(124,58,237,0.2)] border border-[rgba(124,58,237,0.4)] text-[#a78bfa] text-sm font-medium hover:bg-[rgba(124,58,237,0.3)] transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Check Answer
                </motion.button>
              )}
              {isRevealed && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={next}
                  id="next-question-button"
                  className="flex items-center gap-2 px-5 py-2.5 btn-primary"
                >
                  {currentQ < quiz.questions.length - 1 ? "Next Question" : "See Results"}
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
