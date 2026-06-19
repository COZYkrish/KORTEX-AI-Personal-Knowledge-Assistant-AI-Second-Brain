"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, File, Loader2, CheckCircle2,
  AlertCircle, Trash2, Eye, Star, StarOff, Tag,
  Search, Filter, Grid3X3, List, X, Clock,
} from "lucide-react";

interface Document {
  id: string;
  title: string;
  fileName: string;
  fileSize: number;
  status: "PENDING" | "EXTRACTING" | "EMBEDDING" | "GRAPHING" | "READY" | "ERROR";
  isFavorite: boolean;
  tags: string[];
  createdAt: string;
  mimeType: string;
}

const STATUS_CONFIG = {
  PENDING: { label: "Queued", color: "#64748b", icon: Clock },
  EXTRACTING: { label: "Extracting", color: "#f59e0b", icon: Loader2 },
  EMBEDDING: { label: "Embedding", color: "#00d4ff", icon: Loader2 },
  GRAPHING: { label: "Building Graph", color: "#a855f7", icon: Loader2 },
  READY: { label: "Ready", color: "#10b981", icon: CheckCircle2 },
  ERROR: { label: "Error", color: "#ef4444", icon: AlertCircle },
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function DropZone({ onFiles }: { onFiles: (files: File[]) => void }) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const files = Array.from(e.dataTransfer.files).filter(
        (f) =>
          f.type === "application/pdf" ||
          f.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          f.type === "text/plain"
      );
      if (files.length) onFiles(files);
    },
    [onFiles]
  );

  return (
    <motion.div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      animate={{ borderColor: dragging ? "rgba(124,58,237,0.8)" : "rgba(124,58,237,0.2)", scale: dragging ? 1.01 : 1 }}
      className="border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all"
      style={{ background: dragging ? "rgba(124,58,237,0.08)" : "rgba(13,20,64,0.4)" }}
      onClick={() => document.getElementById("file-input")?.click()}
      id="document-dropzone"
    >
      <input
        id="file-input"
        type="file"
        multiple
        accept=".pdf,.docx,.txt"
        className="hidden"
        onChange={(e) => e.target.files && onFiles(Array.from(e.target.files))}
      />
      <motion.div
        animate={{ y: dragging ? -8 : 0 }}
        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#5b21b6] flex items-center justify-center mx-auto mb-4"
      >
        <Upload className="w-8 h-8 text-white" />
      </motion.div>
      <h3 className="text-white font-semibold text-lg mb-2">
        {dragging ? "Drop files here" : "Upload Documents"}
      </h3>
      <p className="text-[#64748b] text-sm">
        Drag & drop PDFs, DOCX, or TXT files · Max 50MB each
      </p>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-[rgba(124,58,237,0.2)] border border-[rgba(124,58,237,0.4)] text-[#a78bfa] text-sm font-medium"
      >
        <Upload className="w-4 h-4" />
        Choose Files
      </motion.div>
    </motion.div>
  );
}

function DocumentCard({ doc, view }: { doc: Document; view: "grid" | "list" }) {
  const status = STATUS_CONFIG[doc.status];
  const StatusIcon = status.icon;
  const isProcessing = ["PENDING", "EXTRACTING", "EMBEDDING", "GRAPHING"].includes(doc.status);

  if (view === "list") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        whileHover={{ x: 4 }}
        className="glass flex items-center gap-4 px-5 py-4 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-xl bg-[rgba(124,58,237,0.15)] flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-[#7c3aed]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-white font-medium truncate">{doc.title}</span>
            {doc.isFavorite && <Star className="w-3.5 h-3.5 text-[#f59e0b] fill-current shrink-0" />}
          </div>
          <span className="text-xs text-[#64748b]">{doc.fileName} · {formatBytes(doc.fileSize)}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusIcon className={`w-4 h-4 ${isProcessing ? "animate-spin" : ""}`} style={{ color: status.color }} />
          <span className="text-xs font-medium" style={{ color: status.color }}>{status.label}</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 rounded-lg hover:bg-[rgba(124,58,237,0.2)] text-[#64748b] hover:text-[#a78bfa] transition-colors" title="View">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-[rgba(239,68,68,0.1)] text-[#64748b] hover:text-[#ef4444] transition-colors" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="glass p-5 cursor-pointer group flex flex-col gap-3"
    >
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-[rgba(124,58,237,0.15)] flex items-center justify-center">
          <FileText className="w-5 h-5 text-[#7c3aed]" />
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 rounded-lg hover:bg-[rgba(124,58,237,0.2)] text-[#64748b] hover:text-[#a78bfa] transition-colors">
            {doc.isFavorite ? <Star className="w-4 h-4 text-[#f59e0b] fill-current" /> : <StarOff className="w-4 h-4" />}
          </button>
          <button className="p-1.5 rounded-lg hover:bg-[rgba(239,68,68,0.1)] text-[#64748b] hover:text-[#ef4444] transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div>
        <h3 className="text-white font-medium text-sm leading-snug mb-1 line-clamp-2">{doc.title}</h3>
        <p className="text-[#64748b] text-xs">{formatBytes(doc.fileSize)}</p>
      </div>
      {doc.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {doc.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(124,58,237,0.15)] text-[#a78bfa]">
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-1.5 mt-auto pt-2 border-t border-[rgba(124,58,237,0.1)]">
        <StatusIcon className={`w-3.5 h-3.5 ${isProcessing ? "animate-spin" : ""}`} style={{ color: status.color }} />
        <span className="text-xs font-medium" style={{ color: status.color }}>{status.label}</span>
      </div>
    </motion.div>
  );
}

const DEMO_DOCS: Document[] = [
  { id: "1", title: "Machine Learning Fundamentals", fileName: "ml-fundamentals.pdf", fileSize: 2456000, status: "READY", isFavorite: true, tags: ["AI", "ML"], createdAt: "2024-01-15", mimeType: "application/pdf" },
  { id: "2", title: "Deep Learning with PyTorch", fileName: "deep-learning.pdf", fileSize: 5123000, status: "READY", isFavorite: false, tags: ["Deep Learning", "PyTorch"], createdAt: "2024-01-14", mimeType: "application/pdf" },
  { id: "3", title: "Neural Architecture Search", fileName: "nas-paper.pdf", fileSize: 890000, status: "EMBEDDING", isFavorite: false, tags: ["Research"], createdAt: "2024-01-13", mimeType: "application/pdf" },
];

export default function DocumentsPage() {
  const [docs] = useState<Document[]>(DEMO_DOCS);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);

  const filtered = docs.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const handleFiles = async (files: File[]) => {
    setUploading(true);
    // Simulate upload
    await new Promise((r) => setTimeout(r, 2000));
    setUploading(false);
    setShowUpload(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Documents</h1>
          <p className="text-[#a8b2d8] text-sm mt-0.5">{docs.length} documents in your knowledge base</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowUpload(true)}
          id="upload-document-button"
          className="btn-primary flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload
        </motion.button>
      </motion.div>

      {/* Upload modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
            onClick={() => setShowUpload(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl glass-bright rounded-2xl p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setShowUpload(false)} className="absolute top-4 right-4 text-[#64748b] hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
              <h2 className="font-display text-xl font-bold text-white mb-6">Upload Documents</h2>
              {uploading ? (
                <div className="flex flex-col items-center py-12 gap-4">
                  <Loader2 className="w-10 h-10 text-[#7c3aed] animate-spin" />
                  <p className="text-[#a8b2d8]">Processing your documents...</p>
                </div>
              ) : (
                <DropZone onFiles={handleFiles} />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
          <input
            id="document-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[rgba(13,20,64,0.6)] border border-[rgba(124,58,237,0.2)] text-white placeholder-[#64748b] text-sm focus:outline-none focus:border-[rgba(124,58,237,0.6)] transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm text-[#a8b2d8] hover:text-white hover:border-[rgba(124,58,237,0.4)] transition-all">
          <Filter className="w-4 h-4" />
          Filter
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm text-[#a8b2d8] hover:text-white hover:border-[rgba(124,58,237,0.4)] transition-all">
          <Tag className="w-4 h-4" />
          Tags
        </button>
        <div className="flex items-center gap-1 glass rounded-xl p-1 ml-auto">
          <button
            onClick={() => setView("grid")}
            id="view-grid-button"
            className={`p-2 rounded-lg transition-all ${view === "grid" ? "bg-[rgba(124,58,237,0.3)] text-white" : "text-[#64748b] hover:text-white"}`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("list")}
            id="view-list-button"
            className={`p-2 rounded-lg transition-all ${view === "list" ? "bg-[rgba(124,58,237,0.3)] text-white" : "text-[#64748b] hover:text-white"}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Documents grid/list */}
      <AnimatePresence mode="wait">
        {view === "grid" ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filtered.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} view="grid" />
            ))}
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
            {filtered.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} view="list" />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {filtered.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <File className="w-12 h-12 text-[#64748b] mx-auto mb-4" />
          <p className="text-[#64748b]">No documents found</p>
        </motion.div>
      )}
    </div>
  );
}
