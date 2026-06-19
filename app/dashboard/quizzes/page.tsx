"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList, Sparkles, CheckCircle2, XCircle,
  ChevronRight, RotateCcw, Trophy, Target, Clock,
  Loader2, AlertCircle,
} from "lucide-react";
import { B } from "@/lib/bauhaus";

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
    if (!revealed) return selected ? "#F0C020" : "#ffffff";
    if (correct) return "#1040C0";
    if (selected && !correct) return "#D02020";
    return "#ffffff";
  };
  const getTextColor = () => {
    if (!revealed) return "#121212";
    if (correct) return "#ffffff";
    if (selected && !correct) return "#ffffff";
    return "#121212";
  };
  const getBorderColor = () => {
    return "#121212";
  };

  return (
    <button
      onClick={!revealed ? onClick : undefined}
      className={`w-full flex items-center gap-3 px-4 py-3.5 border-2 text-left transition-all text-sm font-bold uppercase tracking-wide rounded-none cursor-pointer ${
        !revealed ? "shadow-[2px_2px_0px_0px_#121212] hover:translate-x-1" : ""
      }`}
      style={{
        background: getBg(),
        color: getTextColor(),
        borderColor: getBorderColor(),
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      {revealed && correct && <CheckCircle2 className="w-4.5 h-4.5 text-white shrink-0" />}
      {revealed && selected && !correct && <XCircle className="w-4.5 h-4.5 text-white shrink-0" />}
      {(!revealed || (!correct && !selected)) && (
        <div className={`w-4 h-4 border-2 shrink-0 rounded-none ${selected ? "bg-[#121212] border-[#121212]" : "bg-white border-[#121212]"}`} />
      )}
      <span>{option}</span>
    </button>
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
      <div className="max-w-2xl mx-auto pb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border-4 border-[#121212] p-12 text-center shadow-[8px_8px_0px_0px_#121212] rounded-none"
        >
          <div
            className="w-20 h-20 border-4 border-[#121212] mx-auto mb-6 flex items-center justify-center shadow-[4px_4px_0px_0px_#121212] rounded-none"
            style={{ background: pct >= 80 ? B.BLUE : pct >= 60 ? B.YELLOW : B.RED }}
          >
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="font-display text-3xl font-black uppercase tracking-tight text-[#121212] mb-2" style={B.displayStyle}>Quiz Complete!</h2>
          <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-8" style={B.labelStyle}>
            {pct >= 80 ? "Excellent work! 🎉" : pct >= 60 ? "Good effort! Keep learning." : "Keep studying — you'll get there!"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: "Final Score", value: `${pct}%`, color: pct >= 80 ? B.BLUE : pct >= 60 ? B.YELLOW : B.RED },
              { label: "Correct Answers", value: `${score}/${quiz.questions.length}`, color: B.RED },
              { label: "Elapsed Time", value: "4:32", color: B.BLUE },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-[#F0F0F0] border-2 border-[#121212] p-4 shadow-[3px_3px_0px_0px_#121212] rounded-none">
                <div className="text-2xl font-black" style={{ color, fontFamily: "'Outfit', sans-serif" }}>{value}</div>
                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1" style={B.labelStyle}>{label}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 border-t-2 border-dashed border-[#121212] pt-6">
            <button
              onClick={() => { setDone(false); setCurrentQ(0); setAnswers({}); setRevealed({}); }}
              className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-[#121212] text-[#121212] font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_#121212] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#121212] transition-colors cursor-pointer rounded-none"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              <RotateCcw className="w-4 h-4 text-[#121212]" />
              Retry Quiz
            </button>
            <button
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#D02020] text-white border-2 border-[#121212] font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_#121212] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#121212] cursor-pointer rounded-none"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              <Sparkles className="w-4 h-4 text-white" />
              Generate Flashcards
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-black uppercase tracking-tight text-[#121212]" style={B.displayStyle}>
            Quizzes
          </h1>
          <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mt-1" style={B.labelStyle}>
            AI syllabus validator generated from your context
          </p>
        </div>
        <button
          onClick={generate}
          disabled={generating}
          id="generate-quiz-button"
          className="inline-flex items-center justify-center gap-2 bg-[#D02020] text-white border-2 border-[#121212] font-black uppercase tracking-wider text-xs shadow-[3px_3px_0px_0px_#121212] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#121212] transition-all cursor-pointer rounded-none px-4 py-2.5"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          {generating ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Sparkles className="w-4 h-4 text-white" />
          )}
          Generate Quiz
        </button>
      </motion.div>

      {/* Progress tracking */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }} className="bg-white border-2 border-[#121212] p-5 shadow-[4px_4px_0px_0px_#121212] rounded-none">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-[#1040C0]" />
            <span className="text-sm font-extrabold text-[#121212] uppercase" style={{ fontFamily: "'Outfit', sans-serif" }}>{quiz.title}</span>
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-gray-500" style={B.labelStyle}>
            {currentQ + 1} of {quiz.questions.length} Questions
          </span>
        </div>
        <div className="h-4 border-2 border-[#121212] bg-[#F0F0F0] overflow-hidden rounded-none">
          <motion.div
            animate={{ width: `${((currentQ + (isRevealed ? 1 : 0)) / quiz.questions.length) * 100}%` }}
            transition={{ duration: 0.4 }}
            className="h-full bg-[#1040C0]"
          />
        </div>
        <div className="flex gap-2 mt-4">
          {quiz.questions.map((question, i) => {
            const isCorrect = answers[question.id] === question.correctAnswer;
            const isWrong = answers[question.id] && answers[question.id] !== question.correctAnswer;
            let barBg = "bg-white border border-[#121212]";
            if (revealed[question.id]) {
              barBg = isCorrect ? "bg-[#1040C0]" : "bg-[#D02020]";
            } else if (i === currentQ) {
              barBg = "bg-[#F0C020]";
            }
            return (
              <div
                key={question.id}
                className={`h-2 flex-1 rounded-none border border-[#121212] ${barBg}`}
              />
            );
          })}
        </div>
      </motion.div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -25 }}
          className="bg-white border-4 border-[#121212] p-8 shadow-[6px_6px_0px_0px_#121212] rounded-none space-y-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 border-2 border-[#121212] bg-[#1040C0] text-white flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#121212] font-black rounded-none" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Q{currentQ + 1}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 border border-[#121212] bg-[#F0C020] text-[#121212] mb-3 inline-block" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {q.type.replace("_", " ")}
              </span>
              <p className="text-[#121212] font-black text-lg leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>{q.content}</p>
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

          {/* Explanation drawer */}
          <AnimatePresence>
            {isRevealed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-[#F0F0F0] border-2 border-[#121212] p-5 flex gap-3 rounded-none shadow-[3px_3px_0px_0px_#121212]"
              >
                {answers[q.id] === q.correctAnswer ? (
                  <CheckCircle2 className="w-5 h-5 text-[#1040C0] shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-[#D02020] shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-sm font-black uppercase tracking-wide mb-1" style={{ color: answers[q.id] === q.correctAnswer ? "#1040C0" : "#D02020", fontFamily: "'Outfit', sans-serif" }}>
                    {answers[q.id] === q.correctAnswer ? "Correct Choice!" : `Incorrect Choice — Correct Answer: ${q.correctAnswer}`}
                  </p>
                  <p className="text-xs font-semibold text-gray-700 leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>{q.explanation}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-[#121212]">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider" style={B.labelStyle}>
              <Clock className="w-4 h-4 text-[#121212]" />
              <span>Paced learning active</span>
            </div>
            <div className="flex gap-3">
              {isAnswered && !isRevealed && (
                <button
                  onClick={check}
                  id="check-answer-button"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#F0C020] text-[#121212] border-2 border-[#121212] font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_#121212] hover:bg-[#d4a818] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#121212] transition-all cursor-pointer rounded-none"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Check Answer
                </button>
              )}
              {isRevealed && (
                <button
                  onClick={next}
                  id="next-question-button"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#D02020] text-white border-2 border-[#121212] font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_#121212] hover:bg-[#b01a1a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#121212] transition-all cursor-pointer rounded-none"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {currentQ < quiz.questions.length - 1 ? "Next Question" : "See Results"}
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
