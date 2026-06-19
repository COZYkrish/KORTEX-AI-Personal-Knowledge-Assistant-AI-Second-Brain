"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, TrendingUp, FileText, MessageSquare,
  BookOpen, Search, Brain, Zap, Calendar, Activity,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { B } from "@/lib/bauhaus";

const ACTIVITY_DATA = [
  { day: "Mon", documents: 2, chats: 5, flashcards: 12, searches: 8 },
  { day: "Tue", documents: 1, chats: 8, flashcards: 20, searches: 15 },
  { day: "Wed", documents: 3, chats: 3, flashcards: 8, searches: 6 },
  { day: "Thu", documents: 0, chats: 12, flashcards: 25, searches: 20 },
  { day: "Fri", documents: 2, chats: 6, flashcards: 15, searches: 12 },
  { day: "Sat", documents: 4, chats: 9, flashcards: 30, searches: 18 },
  { day: "Sun", documents: 1, chats: 4, flashcards: 10, searches: 9 },
];

const MASTERY_DATA = [
  { subject: "Neural Networks", A: 82 },
  { subject: "Transformers", A: 55 },
  { subject: "Optimization", A: 78 },
  { subject: "Regularization", A: 60 },
  { subject: "Architecture", A: 45 },
  { subject: "Training", A: 70 },
];

const CUSTOM_TOOLTIP = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border-2 border-[#121212] shadow-[3px_3px_0px_0px_#121212] px-4 py-3 text-xs space-y-1.5">
      <p className="font-extrabold text-[#121212] uppercase tracking-wider mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 font-bold">
          <span style={{ color: p.color === "#121212" ? B.BLUE : p.color }}>{p.name}</span>
          <span className="text-[#121212]">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const TOP_DOCUMENTS = [
  { title: "Machine Learning Fundamentals", chats: 24, summaries: 3, color: B.BLUE },
  { title: "Deep Learning with PyTorch", chats: 18, summaries: 2, color: B.RED },
  { title: "Neural Architecture Search", chats: 9, summaries: 1, color: B.YELLOW },
];

export default function AnalyticsPage() {
  const [range, setRange] = useState<"7d" | "30d" | "90d">("7d");

  const stats = [
    { icon: FileText, label: "Documents", value: "12", delta: "+3 this week", color: B.BLUE },
    { icon: MessageSquare, label: "AI Chats", value: "47", delta: "+12 this week", color: B.RED },
    { icon: BookOpen, label: "Flashcards reviewed", value: "120", delta: "+35 this week", color: B.YELLOW },
    { icon: Search, label: "Searches", value: "88", delta: "+22 this week", color: B.BLUE },
    { icon: Brain, label: "Concepts extracted", value: "243", delta: "+40 this week", color: B.RED },
    { icon: Zap, label: "Quizzes completed", value: "8", delta: "+2 this week", color: B.YELLOW },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-black uppercase tracking-tight text-[#121212]" style={B.displayStyle}>
            Analytics
          </h1>
          <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mt-1" style={B.labelStyle}>
            Your learning insights
          </p>
        </div>
        <div className="flex items-center bg-white border-2 border-[#121212] p-1 shadow-[3px_3px_0px_0px_#121212]">
          {(["7d", "30d", "90d"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-2 font-bold uppercase text-xs tracking-wider transition-all cursor-pointer ${
                range === r
                  ? "bg-[#D02020] text-white border border-[#121212]"
                  : "text-[#121212] hover:bg-gray-100"
              }`}
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              {r}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Stats grid */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map(({ icon: Icon, label, value, delta, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.03 }}
            className="bg-white border-2 border-[#121212] p-6 shadow-[4px_4px_0px_0px_#121212]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 border-2 border-[#121212] flex items-center justify-center shadow-[2px_2px_0px_0px_#121212]" style={{ background: color }}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 font-extrabold text-xs uppercase tracking-wider" style={B.labelStyle}>
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Up</span>
              </div>
            </div>
            <div className="text-3xl font-black text-[#121212]" style={{ fontFamily: "'Outfit', sans-serif" }}>{value}</div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1" style={B.labelStyle}>{label}</div>
            <div className="text-xs text-emerald-600 font-extrabold uppercase mt-2" style={{ fontFamily: "'Outfit', sans-serif" }}>{delta}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Activity chart */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white border-2 border-[#121212] p-6 shadow-[6px_6px_0px_0px_#121212]">
        <div className="flex items-center gap-3 mb-6 border-b-2 border-[#121212] pb-4">
          <Activity className="w-6 h-6 text-[#1040C0]" />
          <h2 className="text-xl font-black uppercase tracking-tight text-[#121212]" style={B.displayStyle}>Activity Overview</h2>
        </div>
        <div className="w-full">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={ACTIVITY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="day" tick={{ fill: "#121212", fontSize: 11, fontWeight: "bold" }} axisLine={{ stroke: '#121212', strokeWidth: 2 }} tickLine={false} />
              <YAxis tick={{ fill: "#121212", fontSize: 11, fontWeight: "bold" }} axisLine={{ stroke: '#121212', strokeWidth: 2 }} tickLine={false} />
              <Tooltip content={<CUSTOM_TOOLTIP />} />
              <Area type="monotone" dataKey="chats" name="Chats" stroke="#D02020" fill="#D02020" fillOpacity={0.15} strokeWidth={3} dot={{ stroke: '#121212', strokeWidth: 2, fill: '#D02020', r: 4 }} />
              <Area type="monotone" dataKey="flashcards" name="Flashcards" stroke="#1040C0" fill="#1040C0" fillOpacity={0.15} strokeWidth={3} dot={{ stroke: '#121212', strokeWidth: 2, fill: '#1040C0', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mastery radar */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white border-2 border-[#121212] p-6 shadow-[6px_6px_0px_0px_#121212]">
          <div className="flex items-center gap-3 mb-6 border-b-2 border-[#121212] pb-4">
            <Brain className="w-6 h-6 text-[#D02020]" />
            <h2 className="text-xl font-black uppercase tracking-tight text-[#121212]" style={B.displayStyle}>Topic Mastery</h2>
          </div>
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={MASTERY_DATA}>
                <PolarGrid stroke="#e0e0e0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#121212", fontSize: 10, fontWeight: "bold" }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#121212", fontSize: 9 }} />
                <Radar name="Mastery" dataKey="A" stroke="#D02020" fill="#D02020" fillOpacity={0.2} strokeWidth={3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top documents */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white border-2 border-[#121212] p-6 shadow-[6px_6px_0px_0px_#121212]">
          <div className="flex items-center gap-3 mb-6 border-b-2 border-[#121212] pb-4">
            <BarChart3 className="w-6 h-6 text-[#F0C020]" />
            <h2 className="text-xl font-black uppercase tracking-tight text-[#121212]" style={B.displayStyle}>Most Referenced</h2>
          </div>
          <div className="space-y-5">
            {TOP_DOCUMENTS.map((doc, i) => (
              <div key={doc.title} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white w-5 h-5 flex items-center justify-center border border-[#121212]" style={{ background: doc.color }}>{i + 1}</span>
                    <span className="text-sm font-extrabold text-[#121212] truncate max-w-[200px] sm:max-w-[280px]" style={{ fontFamily: "'Outfit', sans-serif" }}>{doc.title}</span>
                  </div>
                  <span className="text-xs font-black text-[#121212] uppercase tracking-wider" style={B.labelStyle}>{doc.chats} chats</span>
                </div>
                <div className="h-4 border-2 border-[#121212] bg-[#F0F0F0] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(doc.chats / 24) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                    className="h-full border-r border-[#121212]"
                    style={{ background: doc.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t-2 border-dashed border-[#121212]">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider" style={B.labelStyle}>
              <Calendar className="w-4 h-4 text-[#121212]" />
              <span>Updated just now</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
