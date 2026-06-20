"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, File, Loader2, CheckCircle2,
  AlertCircle, Trash2, Eye, Star, StarOff, Tag,
  Search, Filter, Grid3X3, List, X, Clock,
} from "lucide-react";
import { B } from "@/lib/bauhaus";

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
  PENDING: { label: "Queued", color: "#121212", icon: Clock },
  EXTRACTING: { label: "Extracting", color: "#1040C0", icon: Loader2 },
  EMBEDDING: { label: "Embedding", color: "#F0C020", icon: Loader2 },
  GRAPHING: { label: "Building Graph", color: "#D02020", icon: Loader2 },
  READY: { label: "Ready", color: "#1040C0", icon: CheckCircle2 },
  ERROR: { label: "Error", color: "#D02020", icon: AlertCircle },
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
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`border-4 border-dashed p-10 text-center cursor-pointer transition-all rounded-none ${
        dragging
          ? "border-[#D02020] bg-red-50 shadow-[6px_6px_0px_0px_#121212]"
          : "border-[#121212] bg-white shadow-[4px_4px_0px_0px_#121212]"
      }`}
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
      <div className="w-14 h-14 border-2 border-[#121212] bg-[#1040C0] text-white flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0px_0px_#121212]">
        <Upload className="w-6 h-6" />
      </div>
      <h3 className="text-[#121212] font-black text-lg uppercase tracking-tight mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
        {dragging ? "Drop files here" : "Upload Documents"}
      </h3>
      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4" style={B.labelStyle}>
        Drag & drop PDFs, DOCX, or TXT files · Max 50MB each
      </p>
      <button
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D02020] text-white border-2 border-[#121212] font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_#121212] hover:bg-[#b01a1a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#121212] transition-all cursor-pointer rounded-none"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        <Upload className="w-4 h-4" />
        Choose Files
      </button>
    </div>
  );
}

function DocumentCard({ doc, view, onFavorite, onDelete }: { doc: Document; view: "grid" | "list"; onFavorite: () => void; onDelete: () => void }) {
  const status = STATUS_CONFIG[doc.status];
  const StatusIcon = status.icon;
  const isProcessing = ["PENDING", "EXTRACTING", "EMBEDDING", "GRAPHING"].includes(doc.status);

  if (view === "list") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        className="bg-white border-2 border-[#121212] flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 cursor-pointer shadow-[3px_3px_0px_0px_#121212] rounded-none hover:translate-x-1 transition-all group"
      >
        <div className="flex items-center gap-4 min-w-0">
          <button 
            onClick={(e) => { e.stopPropagation(); onFavorite(); }} 
            className="p-1 border border-transparent hover:border-[#121212] hover:bg-gray-50 rounded-none shrink-0"
          >
            {doc.isFavorite ? (
              <Star className="w-4.5 h-4.5 text-[#F0C020] fill-[#F0C020] stroke-[#121212] stroke-2" />
            ) : (
              <StarOff className="w-4.5 h-4.5 text-gray-400 stroke-2" />
            )}
          </button>
          <div className="w-10 h-10 border-2 border-[#121212] bg-[#F0C020] text-[#121212] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#121212]">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[#121212] font-extrabold truncate" style={{ fontFamily: "'Outfit', sans-serif" }}>{doc.title}</span>
            </div>
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block mt-0.5" style={B.labelStyle}>
              {doc.fileName} · {formatBytes(doc.fileSize)}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
          <div className="flex items-center gap-2">
            <StatusIcon className={`w-4 h-4 ${isProcessing ? "animate-spin" : ""}`} style={{ color: status.color }} />
            <span className="text-xs font-black uppercase tracking-wider" style={{ color: status.color, fontFamily: "'Outfit', sans-serif" }}>{status.label}</span>
          </div>
          <div className="flex items-center gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-2 border-2 border-[#121212] bg-white text-[#121212] hover:bg-[#D02020] hover:text-white transition-all cursor-pointer shadow-[2px_2px_0px_0px_#121212] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#121212] rounded-none" 
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
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
      className="bg-white border-2 border-[#121212] p-5 cursor-pointer shadow-[4px_4px_0px_0px_#121212] flex flex-col gap-4 rounded-none hover:-translate-y-1 transition-all group"
    >
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 border-2 border-[#121212] bg-[#F0C020] text-[#121212] flex items-center justify-center shadow-[2px_2px_0px_0px_#121212]">
          <FileText className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.stopPropagation(); onFavorite(); }} 
            className="p-1.5 border border-[#121212] bg-white text-[#121212] hover:bg-[#F0C020] transition-colors cursor-pointer rounded-none"
          >
            {doc.isFavorite ? <Star className="w-4 h-4 text-[#F0C020] fill-[#F0C020]" /> : <StarOff className="w-4 h-4" />}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1.5 border border-[#121212] bg-white text-[#121212] hover:bg-[#D02020] hover:text-white transition-colors cursor-pointer rounded-none"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div>
        <h3 className="text-[#121212] font-extrabold text-sm leading-snug mb-1 line-clamp-2" style={{ fontFamily: "'Outfit', sans-serif" }}>{doc.title}</h3>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider" style={B.labelStyle}>{formatBytes(doc.fileSize)}</p>
      </div>
      {doc.tags && doc.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {doc.tags.slice(0, 2).map((tag, idx) => (
            <span key={tag} className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 border border-[#121212] rounded-none text-white ${idx % 2 === 0 ? "bg-[#1040C0]" : "bg-[#D02020]"}`} style={{ fontFamily: "'Outfit', sans-serif" }}>
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-1.5 mt-auto pt-3 border-t border-dashed border-[#121212]">
        <StatusIcon className={`w-3.5 h-3.5 ${isProcessing ? "animate-spin" : ""}`} style={{ color: status.color }} />
        <span className="text-xs font-black uppercase tracking-wider" style={{ color: status.color, fontFamily: "'Outfit', sans-serif" }}>{status.label}</span>
      </div>
    </motion.div>
  );
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchDocs = async () => {
    try {
      const res = await fetch("/api/documents");
      if (res.ok) {
        const data = await res.json();
        setDocs(data);
      }
    } catch (err) {
      console.error("Error loading documents:", err);
    }
  };

  // Initial load
  useEffect(() => {
    fetchDocs();
  }, []);

  // Poll status of processing documents
  useEffect(() => {
    const isProcessing = docs.some((d) => ["PENDING", "EXTRACTING", "EMBEDDING", "GRAPHING"].includes(d.status));
    if (!isProcessing) return;

    const interval = setInterval(() => {
      fetchDocs();
    }, 2500);

    return () => clearInterval(interval);
  }, [docs]);

  const filtered = docs.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      (d.tags && d.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())))
  );

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;
    setUploading(true);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        await fetch("/api/documents", {
          method: "POST",
          body: formData,
        });
      }
      await fetchDocs();
    } catch (err) {
      console.error("Error uploading file:", err);
    } finally {
      setUploading(false);
      setShowUpload(false);
    }
  };

  const handleFavorite = async (id: string) => {
    try {
      const doc = docs.find((d) => d.id === id);
      if (!doc) return;

      const res = await fetch(`/api/documents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: !doc.isFavorite }),
      });

      if (res.ok) {
        setDocs((prev) =>
          prev.map((d) => (d.id === id ? { ...d, isFavorite: !d.isFavorite } : d))
        );
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document? This will remove all chunks and embeddings.")) return;
    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDocs((prev) => prev.filter((d) => d.id !== id));
      }
    } catch (err) {
      console.error("Error deleting document:", err);
    }
  };


  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Page header */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-black uppercase tracking-tight text-[#121212]" style={B.displayStyle}>
            Documents
          </h1>
          <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mt-1" style={B.labelStyle}>
            {docs.length} documents in your knowledge base
          </p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          id="upload-document-button"
          className="inline-flex items-center justify-center gap-2 bg-[#D02020] text-white border-2 border-[#121212] font-black uppercase tracking-wider text-xs shadow-[3px_3px_0px_0px_#121212] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#121212] transition-all cursor-pointer rounded-none px-5 py-3 h-fit sm:self-center"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </motion.div>

      {/* Upload modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowUpload(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl bg-[#F0F0F0] border-4 border-[#121212] p-8 relative shadow-[8px_8px_0px_0px_#121212] rounded-none"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowUpload(false)}
                className="absolute top-4 right-4 p-1.5 border-2 border-[#121212] bg-white text-[#121212] hover:bg-[#D02020] hover:text-white transition-all cursor-pointer rounded-none shadow-[2px_2px_0px_0px_#121212]"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="font-display text-2xl font-black uppercase tracking-tight text-[#121212] mb-6" style={B.displayStyle}>Upload Documents</h2>
              {uploading ? (
                <div className="flex flex-col items-center py-12 gap-4">
                  <Loader2 className="w-10 h-10 text-[#1040C0] animate-spin" />
                  <p className="text-[#121212] font-bold uppercase tracking-wider text-xs" style={B.labelStyle}>Processing your documents...</p>
                </div>
              ) : (
                <DropZone onFiles={handleFiles} />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters bar */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#121212]" />
          <input
            id="document-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-9 pr-4 py-2.5 border-2 border-[#121212] bg-white text-[#121212] placeholder-gray-400 text-sm font-semibold rounded-none focus:outline-none focus:bg-gray-50 transition-colors shadow-[3px_3px_0px_0px_#121212]"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-[#121212] text-[#121212] font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_#121212] hover:bg-gray-50 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#121212] transition-all cursor-pointer rounded-none" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-[#121212] text-[#121212] font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_#121212] hover:bg-gray-50 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#121212] transition-all cursor-pointer rounded-none" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <Tag className="w-4 h-4" />
            Tags
          </button>
          <div className="flex items-center bg-white border-2 border-[#121212] p-1 shadow-[3px_3px_0px_0px_#121212] rounded-none ml-auto md:ml-0">
            <button
              onClick={() => setView("grid")}
              id="view-grid-button"
              className={`p-2 transition-all rounded-none cursor-pointer border ${
                view === "grid"
                  ? "bg-[#1040C0] text-white border-[#121212]"
                  : "text-[#121212] border-transparent hover:bg-gray-100"
              }`}
            >
              <Grid3X3 className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => setView("list")}
              id="view-list-button"
              className={`p-2 transition-all rounded-none cursor-pointer border ${
                view === "list"
                  ? "bg-[#1040C0] text-white border-[#121212]"
                  : "text-[#121212] border-transparent hover:bg-gray-100"
              }`}
            >
              <List className="w-4.5 h-4.5" />
            </button>
          </div>
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filtered.map((doc) => (
              <DocumentCard 
                key={doc.id} 
                doc={doc} 
                view="grid" 
                onFavorite={() => handleFavorite(doc.id)}
                onDelete={() => handleDelete(doc.id)}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {filtered.map((doc) => (
              <DocumentCard 
                key={doc.id} 
                doc={doc} 
                view="list" 
                onFavorite={() => handleFavorite(doc.id)}
                onDelete={() => handleDelete(doc.id)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {filtered.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 bg-white border-2 border-dashed border-[#121212] shadow-[4px_4px_0px_0px_#121212]">
          <File className="w-12 h-12 text-[#121212] mx-auto mb-4" />
          <p className="text-[#121212] font-black uppercase tracking-wider text-sm" style={B.labelStyle}>No documents found</p>
        </motion.div>
      )}
    </div>
  );
}
