"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, FileText, Filter, Clock, Star,
  ChevronRight, X, Sparkles, SlidersHorizontal,
  Tag, Calendar, Hash, Loader2,
} from "lucide-react";

interface SearchResult {
  id: string;
  documentTitle: string;
  excerpt: string;
  pageNumber?: number;
  score: number;
  tags: string[];
  date: string;
  type: "pdf" | "docx" | "txt";
}

const DEMO_RESULTS: SearchResult[] = [
  {
    id: "1",
    documentTitle: "Machine Learning Fundamentals",
    excerpt: "Backpropagation is an algorithm used to train neural networks by computing gradients of the loss function with respect to network weights, propagating the error backwards through the network using the chain rule of calculus.",
    pageNumber: 42,
    score: 0.96,
    tags: ["AI", "ML", "Neural Networks"],
    date: "2024-01-15",
    type: "pdf",
  },
  {
    id: "2",
    documentTitle: "Deep Learning with PyTorch",
    excerpt: "Gradient descent is the primary optimization algorithm used in deep learning. The basic idea is to update parameters in the direction that minimizes the loss function. The learning rate controls step size.",
    pageNumber: 15,
    score: 0.87,
    tags: ["Deep Learning", "PyTorch", "Optimization"],
    date: "2024-01-14",
    type: "pdf",
  },
  {
    id: "3",
    documentTitle: "Neural Architecture Search",
    excerpt: "Self-attention allows each position to attend to all positions in the previous layer. This global receptive field makes transformers particularly powerful for capturing long-range dependencies in sequences.",
    pageNumber: 8,
    score: 0.81,
    tags: ["Research", "Transformers"],
    date: "2024-01-13",
    type: "pdf",
  },
  {
    id: "4",
    documentTitle: "Machine Learning Fundamentals",
    excerpt: "Dropout regularization randomly sets neuron outputs to zero during training with probability p. This prevents co-adaptation of neurons and acts as training an ensemble of exponentially many neural networks.",
    pageNumber: 78,
    score: 0.75,
    tags: ["AI", "Regularization"],
    date: "2024-01-15",
    type: "pdf",
  },
];

const RECENT_SEARCHES = [
  "attention mechanism transformers",
  "gradient descent optimization",
  "dropout regularization",
  "neural network architectures",
];

const FILTER_OPTIONS = {
  type: ["PDF", "DOCX", "TXT"],
  date: ["Today", "This week", "This month", "All time"],
  tags: ["AI", "ML", "Deep Learning", "Research", "PyTorch"],
};

function HighlightedExcerpt({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <span>{text}</span>;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-[rgba(124,58,237,0.3)] text-[#c4b5fd] rounded px-0.5 not-italic">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 0.9 ? "#10b981" : score >= 0.75 ? "#f59e0b" : "#64748b";
  return (
    <span
      className="text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0"
      style={{ background: `${color}20`, color }}
    >
      {Math.round(score * 100)}% match
    </span>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string | null>>({
    type: null,
    date: null,
    tag: null,
  });
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (q = query) => {
    if (!q.trim()) return;
    setQuery(q);
    setLoading(true);
    setSearched(true);
    setSelectedResult(null);
    await new Promise((r) => setTimeout(r, 900));
    setResults(DEMO_RESULTS.filter((r) => r.excerpt.toLowerCase().includes(q.toLowerCase().split(" ")[0]) || Math.random() > 0.3));
    setLoading(false);
  };

  const clearFilter = (key: string) => {
    setActiveFilters((prev) => ({ ...prev, [key]: null }));
  };

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 h-full flex flex-col">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="shrink-0">
        <h1 className="font-display text-2xl font-bold text-white">Semantic Search</h1>
        <p className="text-[#a8b2d8] text-sm mt-0.5">
          Hybrid vector + keyword search across your entire knowledge base
        </p>
      </motion.div>

      {/* Search Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="shrink-0"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7c3aed]" />
          <input
            ref={inputRef}
            id="semantic-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search across all your documents with natural language..."
            className="w-full pl-12 pr-36 py-4 rounded-2xl glass-bright text-white placeholder-[#4a5568] text-base focus:outline-none focus:border-[rgba(124,58,237,0.6)] transition-colors"
            style={{ border: "1px solid rgba(124,58,237,0.3)" }}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {query && (
              <button
                onClick={() => { setQuery(""); setSearched(false); setResults([]); }}
                className="p-1.5 rounded-lg text-[#64748b] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              id="search-filters-toggle"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${showFilters || activeFilterCount > 0 ? "bg-[rgba(124,58,237,0.25)] text-[#a78bfa] border border-[rgba(124,58,237,0.4)]" : "glass text-[#64748b] hover:text-white"}`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSearch()}
              disabled={loading || !query.trim()}
              id="search-submit-button"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#5b21b6] text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Search
            </motion.button>
          </div>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 glass rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Type */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#64748b] mb-2">
                    <FileText className="w-3.5 h-3.5" />
                    File Type
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {FILTER_OPTIONS.type.map((t) => (
                      <button
                        key={t}
                        onClick={() => setActiveFilters((p) => ({ ...p, type: p.type === t ? null : t }))}
                        className={`px-2.5 py-1 rounded-lg text-xs transition-all ${activeFilters.type === t ? "bg-[rgba(124,58,237,0.3)] text-[#a78bfa] border border-[rgba(124,58,237,0.4)]" : "glass text-[#64748b] hover:text-white"}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Date */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#64748b] mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    Date
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {FILTER_OPTIONS.date.map((d) => (
                      <button
                        key={d}
                        onClick={() => setActiveFilters((p) => ({ ...p, date: p.date === d ? null : d }))}
                        className={`px-2.5 py-1 rounded-lg text-xs transition-all ${activeFilters.date === d ? "bg-[rgba(124,58,237,0.3)] text-[#a78bfa] border border-[rgba(124,58,237,0.4)]" : "glass text-[#64748b] hover:text-white"}`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Tags */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#64748b] mb-2">
                    <Tag className="w-3.5 h-3.5" />
                    Tags
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {FILTER_OPTIONS.tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setActiveFilters((p) => ({ ...p, tag: p.tag === tag ? null : tag }))}
                        className={`px-2.5 py-1 rounded-lg text-xs transition-all ${activeFilters.tag === tag ? "bg-[rgba(124,58,237,0.3)] text-[#a78bfa] border border-[rgba(124,58,237,0.4)]" : "glass text-[#64748b] hover:text-white"}`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Body */}
      <div className="flex-1 min-h-0">
        {!searched ? (
          /* Recent searches */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-[#64748b] mb-3">
                <Clock className="w-4 h-4" />
                Recent Searches
              </div>
              <div className="space-y-2">
                {RECENT_SEARCHES.map((s) => (
                  <motion.button
                    key={s}
                    whileHover={{ x: 4 }}
                    onClick={() => handleSearch(s)}
                    className="w-full flex items-center gap-3 px-4 py-3 glass rounded-xl text-left group"
                  >
                    <Hash className="w-4 h-4 text-[#7c3aed] shrink-0" />
                    <span className="text-[#a8b2d8] text-sm group-hover:text-white transition-colors">{s}</span>
                    <ChevronRight className="w-4 h-4 text-[#4a5568] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="glass p-5 rounded-2xl" style={{ background: "radial-gradient(ellipse at 0% 50%, rgba(124,58,237,0.08), transparent 70%), rgba(10,15,46,0.6)" }}>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#7c3aed]" />
                <span className="text-sm font-semibold text-white">Search Tips</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "Ask natural language questions: \"how does attention work?\"",
                  "Search for specific concepts across multiple documents",
                  "Use tags and filters to narrow down results",
                  "Results are ranked by semantic similarity + keyword relevance",
                ].map((tip, i) => (
                  <div key={i} className="flex gap-2 text-xs text-[#64748b]">
                    <span className="text-[#7c3aed] shrink-0 mt-0.5">•</span>
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-5 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[rgba(124,58,237,0.2)] animate-pulse" />
                  <div className="h-4 rounded-full bg-[rgba(124,58,237,0.15)] animate-pulse" style={{ width: "40%" }} />
                  <div className="h-4 rounded-full bg-[rgba(124,58,237,0.1)] animate-pulse ml-auto" style={{ width: "15%" }} />
                </div>
                <div className="space-y-2">
                  <div className="h-3 rounded-full bg-[rgba(124,58,237,0.1)] animate-pulse" />
                  <div className="h-3 rounded-full bg-[rgba(124,58,237,0.08)] animate-pulse" style={{ width: "80%" }} />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {/* Results count */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#64748b]">
                <span className="text-white font-medium">{results.length}</span> results for{" "}
                <span className="text-[#a78bfa]">&quot;{query}&quot;</span>
              </p>
              <div className="flex items-center gap-1.5 text-xs text-[#10b981]">
                <Sparkles className="w-3.5 h-3.5" />
                Hybrid search
              </div>
            </div>

            {results.length === 0 ? (
              <div className="text-center py-20">
                <Search className="w-12 h-12 text-[#64748b] mx-auto mb-4" />
                <p className="text-[#64748b]">No results found for &quot;{query}&quot;</p>
                <p className="text-sm text-[#4a5568] mt-1">Try different keywords or upload more documents</p>
              </div>
            ) : (
              results.map((result, i) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ x: 2 }}
                  onClick={() => setSelectedResult(selectedResult?.id === result.id ? null : result)}
                  className={`glass rounded-2xl p-5 cursor-pointer transition-all ${selectedResult?.id === result.id ? "border-[rgba(124,58,237,0.5)]" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[rgba(124,58,237,0.15)] flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-4 h-4 text-[#7c3aed]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-semibold text-sm truncate">{result.documentTitle}</span>
                        {result.pageNumber && (
                          <span className="text-xs text-[#64748b] shrink-0">· p.{result.pageNumber}</span>
                        )}
                        <ScoreBadge score={result.score} />
                        <Star className="w-3.5 h-3.5 text-[#64748b] hover:text-[#f59e0b] transition-colors ml-auto shrink-0" />
                      </div>
                      <p className="text-sm text-[#a8b2d8] leading-relaxed line-clamp-2">
                        <HighlightedExcerpt text={result.excerpt} query={query} />
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {result.tags.map((tag) => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(124,58,237,0.12)] text-[#a78bfa]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {selectedResult?.id === result.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-[rgba(124,58,237,0.15)] overflow-hidden"
                      >
                        <p className="text-sm text-[#c8d0e8] leading-relaxed mb-3">{result.excerpt}</p>
                        <div className="flex gap-2">
                          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[rgba(124,58,237,0.2)] border border-[rgba(124,58,237,0.3)] text-[#a78bfa] text-xs font-medium hover:bg-[rgba(124,58,237,0.3)] transition-colors">
                            <FileText className="w-3.5 h-3.5" />
                            Open Document
                          </button>
                          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass text-xs text-[#64748b] hover:text-white transition-colors">
                            <Sparkles className="w-3.5 h-3.5" />
                            Ask AI about this
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
