"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, TrendingUp, FileText, MessageSquare,
  BookOpen, Search, Brain, Zap, Calendar, Activity,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

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
    <div className="glass-bright rounded-xl px-4 py-3 text-xs space-y-1 border border-[rgba(124,58,237,0.3)]">
      <p className="font-semibold text-white mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="text-white font-medium">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const TOP_DOCUMENTS = [
  { title: "Machine Learning Fundamentals", chats: 24, summaries: 3, color: "#7c3aed" },
  { title: "Deep Learning with PyTorch", chats: 18, summaries: 2, color: "#00d4ff" },
  { title: "Neural Architecture Search", chats: 9, summaries: 1, color: "#10b981" },
];

export default function AnalyticsPage() {
  const [range, setRange] = useState<"7d" | "30d" | "90d">("7d");

  const stats = [
    { icon: FileText, label: "Documents", value: "12", delta: "+3 this week", color: "#7c3aed" },
    { icon: MessageSquare, label: "AI Chats", value: "47", delta: "+12 this week", color: "#00d4ff" },
    { icon: BookOpen, label: "Flashcards reviewed", value: "120", delta: "+35 this week", color: "#10b981" },
    { icon: Search, label: "Searches", value: "88", delta: "+22 this week", color: "#f59e0b" },
    { icon: Brain, label: "Concepts extracted", value: "243", delta: "+40 this week", color: "#a855f7" },
    { icon: Zap, label: "Quizzes completed", value: "8", delta: "+2 this week", color: "#ef4444" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Analytics</h1>
          <p className="text-[#a8b2d8] text-sm mt-0.5">Your learning insights</p>
        </div>
        <div className="flex items-center gap-1 glass rounded-xl p-1">
          {(["7d", "30d", "90d"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${range === r ? "bg-[rgba(124,58,237,0.3)] text-white" : "text-[#64748b] hover:text-white"}`}
            >
              {r}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Stats grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(({ icon: Icon, label, value, delta, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            whileHover={{ y: -3 }}
            className="glass p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <TrendingUp className="w-4 h-4 text-[#10b981]" />
            </div>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-xs text-[#64748b] mt-0.5">{label}</div>
            <div className="text-xs text-[#10b981] mt-1">{delta}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Activity chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass p-6">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="w-5 h-5 text-[#7c3aed]" />
          <h2 className="font-semibold text-white">Activity Overview</h2>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={ACTIVITY_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradChats" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradCards" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.1)" />
            <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CUSTOM_TOOLTIP />} />
            <Area type="monotone" dataKey="chats" name="Chats" stroke="#7c3aed" fill="url(#gradChats)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="flashcards" name="Flashcards" stroke="#10b981" fill="url(#gradCards)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mastery radar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass p-6">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-5 h-5 text-[#a855f7]" />
            <h2 className="font-semibold text-white">Topic Mastery</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={MASTERY_DATA}>
              <PolarGrid stroke="rgba(124,58,237,0.2)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 9 }} />
              <Radar name="Mastery" dataKey="A" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top documents */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-5 h-5 text-[#00d4ff]" />
            <h2 className="font-semibold text-white">Most Referenced</h2>
          </div>
          <div className="space-y-4">
            {TOP_DOCUMENTS.map((doc, i) => (
              <div key={doc.title} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#64748b] w-4">#{i + 1}</span>
                    <span className="text-sm text-white truncate max-w-[180px]">{doc.title}</span>
                  </div>
                  <span className="text-xs text-[#64748b]">{doc.chats} chats</span>
                </div>
                <div className="h-1.5 rounded-full bg-[rgba(124,58,237,0.15)] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(doc.chats / 24) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ background: doc.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-[rgba(124,58,237,0.1)]">
            <div className="flex items-center gap-2 text-sm text-[#64748b]">
              <Calendar className="w-4 h-4" />
              <span>Updated just now</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
