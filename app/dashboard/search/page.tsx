"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, FileText, Clock, Star,
  ChevronRight, X, Sparkles, SlidersHorizontal,
  Tag, Calendar, Hash, Loader2,
} from "lucide-react";
import { B } from "@/lib/bauhaus";

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
          <mark key={i} className="bg-[#F0C020] text-[#121212] border border-[#121212] font-black px-1 not-italic" style={{ fontFamily: "'Outfit', sans-serif" }}>
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
  return (
    <span
      className="text-[9px] px-2 py-0.5 border border-[#121212] bg-[#1040C0] text-white font-black uppercase tracking-wider rounded-none shrink-0"
      style={{ fontFamily: "'Outfit', sans-serif" }}
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
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        // Map HybridSearchResult from API to the local SearchResult shape
        const mapped = data.map((r: any) => ({
          id: r.id,
          documentTitle: r.documentTitle || "Untitled Document",
          excerpt: r.content,
          pageNumber: r.pageNumber,
          score: r.score,
          tags: r.metadata?.tags || [],
          date: r.metadata?.date || new Date().toISOString().split("T")[0],
          type: r.metadata?.type || "pdf",
        }));
        setResults(mapped);
      }
    } catch (err) {
      console.error("Error running semantic search:", err);
    } finally {
      setLoading(false);
    }
  };

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 h-full flex flex-col">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="shrink-0">
        <h1 className="font-display text-4xl font-black uppercase tracking-tight text-[#121212]" style={B.displayStyle}>
          Semantic Search
        </h1>
        <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mt-1" style={B.labelStyle}>
          Hybrid vector + keyword search across your entire knowledge base
        </p>
      </motion.div>

      {/* Search Box */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="shrink-0 space-y-3"
      >
        <div className="relative border-4 border-[#121212] bg-white shadow-[6px_6px_0px_0px_#121212] rounded-none p-1">
          <div className="flex items-center">
            <Search className="w-5 h-5 text-[#121212] ml-3 shrink-0" />
            <input
              ref={inputRef}
              id="semantic-search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search documents with natural language queries..."
              className="w-full pl-3 pr-40 py-3.5 bg-transparent text-[#121212] placeholder-gray-400 text-sm font-semibold focus:outline-none"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {query && (
                <button
                  onClick={() => { setQuery(""); setSearched(false); setResults([]); }}
                  className="p-1 border border-transparent hover:border-[#121212] hover:bg-gray-100 text-gray-500 hover:text-black transition-colors cursor-pointer rounded-none hidden sm:block"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                id="search-filters-toggle"
                className={`flex items-center gap-1.5 px-3 py-1.5 border border-[#121212] text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#121212] cursor-pointer rounded-none active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#121212] transition-all ${
                  showFilters || activeFilterCount > 0
                    ? "bg-[#F0C020] text-[#121212]"
                    : "bg-white text-[#121212] hover:bg-gray-55"
                }`}
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
              </button>
              <button
                onClick={() => handleSearch()}
                disabled={loading || !query.trim()}
                id="search-submit-button"
                className="flex items-center gap-1.5 px-4 py-2 border-2 border-[#121212] bg-[#D02020] text-white text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#121212] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#121212] transition-all cursor-pointer rounded-none disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-white" /> : <Sparkles className="w-3.5 h-3.5 text-white" />}
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters drawer */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white border-2 border-[#121212] p-5 grid grid-cols-1 sm:grid-cols-3 gap-6 shadow-[4px_4px_0px_0px_#121212] rounded-none">
                {/* Type */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-black text-gray-500 uppercase tracking-wider mb-3" style={B.labelStyle}>
                    <FileText className="w-3.5 h-3.5 text-[#1040C0]" />
                    <span>File Type</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {FILTER_OPTIONS.type.map((t) => {
                      const isActive = activeFilters.type === t;
                      return (
                        <button
                          key={t}
                          onClick={() => setActiveFilters((p) => ({ ...p, type: p.type === t ? null : t }))}
                          className={`px-3 py-1.5 border border-[#121212] text-xs font-black uppercase tracking-wide rounded-none cursor-pointer transition-all shadow-[1.5px_1.5px_0px_0px_#121212] active:translate-x-[0.5px] active:translate-y-[0.5px] ${
                            isActive ? "bg-[#1040C0] text-white" : "bg-white text-[#121212] hover:bg-gray-100"
                          }`}
                          style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {/* Date */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-black text-gray-500 uppercase tracking-wider mb-3" style={B.labelStyle}>
                    <Calendar className="w-3.5 h-3.5 text-[#D02020]" />
                    <span>Date Range</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {FILTER_OPTIONS.date.map((d) => {
                      const isActive = activeFilters.date === d;
                      return (
                        <button
                          key={d}
                          onClick={() => setActiveFilters((p) => ({ ...p, date: p.date === d ? null : d }))}
                          className={`px-3 py-1.5 border border-[#121212] text-xs font-black uppercase tracking-wide rounded-none cursor-pointer transition-all shadow-[1.5px_1.5px_0px_0px_#121212] active:translate-x-[0.5px] active:translate-y-[0.5px] ${
                            isActive ? "bg-[#D02020] text-white" : "bg-white text-[#121212] hover:bg-gray-100"
                          }`}
                          style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {/* Tags */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-black text-gray-500 uppercase tracking-wider mb-3" style={B.labelStyle}>
                    <Tag className="w-3.5 h-3.5 text-[#F0C020]" />
                    <span>Resource Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {FILTER_OPTIONS.tags.map((tag) => {
                      const isActive = activeFilters.tag === tag;
                      return (
                        <button
                          key={tag}
                          onClick={() => setActiveFilters((p) => ({ ...p, tag: p.tag === tag ? null : tag }))}
                          className={`px-3 py-1.5 border border-[#121212] text-xs font-black uppercase tracking-wide rounded-none cursor-pointer transition-all shadow-[1.5px_1.5px_0px_0px_#121212] active:translate-x-[0.5px] active:translate-y-[0.5px] ${
                            isActive ? "bg-[#F0C020] text-[#121212]" : "bg-white text-[#121212] hover:bg-gray-100"
                          }`}
                          style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Body Section */}
      <div className="flex-1 min-h-0">
        {!searched ? (
          /* Recent searches & tips */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-wider" style={B.labelStyle}>
                <Clock className="w-4 h-4 text-[#121212]" />
                <span>Recent Searches</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {RECENT_SEARCHES.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSearch(s)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 bg-white border-2 border-[#121212] shadow-[3px_3px_0px_0px_#121212] text-left hover:translate-x-1 transition-all rounded-none cursor-pointer group"
                  >
                    <Hash className="w-4.5 h-4.5 text-[#1040C0] shrink-0" />
                    <span className="text-[#121212] text-sm font-extrabold uppercase tracking-wide" style={{ fontFamily: "'Outfit', sans-serif" }}>{s}</span>
                    <ChevronRight className="w-4 h-4 text-[#121212] ml-auto group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>

            {/* Help guidelines card */}
            <div className="bg-[#F0C020] border-4 border-[#121212] p-6 shadow-[6px_6px_0px_0px_#121212] rounded-none text-black">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-black" />
                <h3 className="text-lg font-black uppercase tracking-tight" style={B.displayStyle}>Semantic Search Capabilities</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Ask natural language queries like: \"how does attention mechanism work?\"",
                  "Query concept maps and relationships across separate files",
                  "Utilize type and time filters to restrict compilation zones",
                  "Results match concepts using mathematical vector embeddings",
                ].map((tip, i) => (
                  <div key={i} className="flex gap-2 text-xs font-bold leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    <span className="text-[#1040C0] shrink-0 text-sm">•</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : loading ? (
          /* Skeletons */
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border-2 border-[#121212] p-6 space-y-4 shadow-[4px_4px_0px_0px_#121212] rounded-none animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-250 border border-[#121212] rounded-none" />
                  <div className="h-4 bg-gray-250 border border-[#121212] w-1/3" />
                  <div className="h-4 bg-gray-250 border border-[#121212] w-16 ml-auto" />
                </div>
                <div className="space-y-2">
                  <div className="h-3.5 bg-gray-200 w-full" />
                  <div className="h-3.5 bg-gray-200 w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Results count banner */}
            <div className="flex items-center justify-between border-b-2 border-[#121212] pb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500" style={B.labelStyle}>
                Found <span className="text-[#121212] font-black">{results.length}</span> documents matching &quot;<span className="text-[#1040C0]">{query}</span>&quot;
              </p>
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-600" style={B.labelStyle}>
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Hybrid Vector Engine</span>
              </div>
            </div>

            {results.length === 0 ? (
              <div className="text-center py-20 bg-white border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] rounded-none">
                <Search className="w-12 h-12 text-[#121212] mx-auto mb-4" />
                <p className="text-[#121212] font-black uppercase tracking-wider text-sm mb-1" style={B.labelStyle}>No results found for &quot;{query}&quot;</p>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider" style={B.labelStyle}>Try different keywords or upload new files</p>
              </div>
            ) : (
              results.map((result, i) => (
                <div
                  key={result.id}
                  onClick={() => setSelectedResult(selectedResult?.id === result.id ? null : result)}
                  className="bg-white border-2 border-[#121212] p-5 cursor-pointer shadow-[4px_4px_0px_0px_#121212] rounded-none hover:translate-x-0.5 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 border-2 border-[#121212] bg-[#F0C020] text-[#121212] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#121212] rounded-none">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-[#121212] font-extrabold text-sm uppercase tracking-wide" style={{ fontFamily: "'Outfit', sans-serif" }}>{result.documentTitle}</span>
                        {result.pageNumber && (
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider" style={B.labelStyle}>· p.{result.pageNumber}</span>
                        )}
                        <ScoreBadge score={result.score} />
                        <button className="ml-auto p-1.5 border border-[#121212] bg-white text-[#121212] hover:bg-[#F0C020] transition-colors cursor-pointer rounded-none">
                          <Star className="w-3.5 h-3.5 text-[#121212]" />
                        </button>
                      </div>
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wider leading-relaxed line-clamp-2" style={B.labelStyle}>
                        <HighlightedExcerpt text={result.excerpt} query={query} />
                      </p>
                      <div className="flex items-center gap-1.5 mt-3">
                        {result.tags.map((tag, idx) => (
                          <span key={tag} className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 border border-[#121212] rounded-none text-white ${idx % 2 === 0 ? "bg-[#1040C0]" : "bg-[#D02020]"}`} style={{ fontFamily: "'Outfit', sans-serif" }}>
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
                        className="mt-4 pt-4 border-t-2 border-dashed border-[#121212] overflow-hidden"
                      >
                        <p className="text-sm font-semibold text-gray-700 leading-relaxed mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>{result.excerpt}</p>
                        <div className="flex gap-3">
                          <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1040C0] text-white border-2 border-[#121212] font-black uppercase text-[10px] tracking-wider shadow-[2px_2px_0px_0px_#121212] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#121212] rounded-none cursor-pointer">
                            <FileText className="w-3.5 h-3.5 text-white" />
                            Open Document
                          </button>
                          <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#F0C020] text-[#121212] border-2 border-[#121212] font-black uppercase text-[10px] tracking-wider shadow-[2px_2px_0px_0px_#121212] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#121212] rounded-none cursor-pointer">
                            <Sparkles className="w-3.5 h-3.5 text-[#121212]" />
                            Ask AI Assistant
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
