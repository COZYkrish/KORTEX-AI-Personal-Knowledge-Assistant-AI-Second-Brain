"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ReactFlow as ReactFlowComponent, Node, Edge, Background, Controls, MiniMap,
  addEdge, useNodesState, useEdgesState, Connection,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Search, ZoomIn, ZoomOut, Maximize2, RefreshCw, Filter, Sparkles } from "lucide-react";

const CONCEPT_COLORS: Record<string, string> = {
  concept: "#7c3aed",
  entity: "#00d4ff",
  topic: "#10b981",
  technology: "#f59e0b",
};

const INITIAL_NODES: Node[] = [
  { id: "1", position: { x: 400, y: 200 }, data: { label: "Neural Networks", type: "concept", description: "Computational models inspired by biological neural networks" }, type: "default" },
  { id: "2", position: { x: 150, y: 80 }, data: { label: "Deep Learning", type: "topic", description: "ML with multiple neural network layers" }, type: "default" },
  { id: "3", position: { x: 650, y: 80 }, data: { label: "Transformer", type: "technology", description: "Attention-based architecture" }, type: "default" },
  { id: "4", position: { x: 150, y: 340 }, data: { label: "Backpropagation", type: "concept", description: "Algorithm for training neural networks" }, type: "default" },
  { id: "5", position: { x: 650, y: 340 }, data: { label: "Attention Mechanism", type: "concept", description: "Weighing relevant parts of input" }, type: "default" },
  { id: "6", position: { x: 400, y: 420 }, data: { label: "Gradient Descent", type: "concept", description: "Optimization via gradient computation" }, type: "default" },
  { id: "7", position: { x: 900, y: 200 }, data: { label: "GPT", type: "entity", description: "Generative Pre-trained Transformer" }, type: "default" },
  { id: "8", position: { x: 150, y: 200 }, data: { label: "PyTorch", type: "technology", description: "Deep learning framework" }, type: "default" },
];

const INITIAL_EDGES: Edge[] = [
  { id: "e1-2", source: "1", target: "2", label: "enables", animated: true },
  { id: "e1-3", source: "1", target: "3", label: "includes", animated: true },
  { id: "e1-4", source: "1", target: "4", label: "trained via" },
  { id: "e3-5", source: "3", target: "5", label: "uses" },
  { id: "e4-6", source: "4", target: "6", label: "uses" },
  { id: "e3-7", source: "3", target: "7", label: "basis of" },
  { id: "e2-8", source: "2", target: "8", label: "implemented in" },
  { id: "e1-6", source: "1", target: "6", label: "optimized by" },
];

const nodeStyles = {
  background: "rgba(13, 20, 64, 0.9)",
  border: "1px solid rgba(124, 58, 237, 0.4)",
  borderRadius: "12px",
  padding: "10px 16px",
  color: "#e2e8f0",
  fontSize: "13px",
  fontWeight: 600,
  backdropFilter: "blur(12px)",
  boxShadow: "0 0 20px rgba(124, 58, 237, 0.2)",
};

export default function KnowledgeGraphPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);
  const [search, setSearch] = useState("");
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const filteredNodes = nodes.map((n) => ({
    ...n,
    style: {
      ...nodeStyles,
      border: `1px solid ${CONCEPT_COLORS[(n.data as any).type] ?? "#7c3aed"}40`,
      boxShadow: `0 0 20px ${CONCEPT_COLORS[(n.data as any).type] ?? "#7c3aed"}20`,
      opacity:
        (search && !(n.data as any).label.toLowerCase().includes(search.toLowerCase())) ||
        (filter && (n.data as any).type !== filter)
          ? 0.2
          : 1,
    },
  }));

  return (
    <div className="h-full flex flex-col gap-4 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Knowledge Graph</h1>
          <p className="text-[#a8b2d8] text-sm mt-0.5">{nodes.length} concepts · {edges.length} relationships</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            id="regenerate-graph-button"
            className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-sm text-[#a8b2d8] hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            id="expand-graph-button"
            className="btn-primary flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            AI Expand
          </motion.button>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-center gap-3 flex-wrap shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
          <input
            id="graph-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search concepts..."
            className="pl-9 pr-4 py-2 rounded-xl bg-[rgba(13,20,64,0.6)] border border-[rgba(124,58,237,0.2)] text-white placeholder-[#64748b] text-sm focus:outline-none focus:border-[rgba(124,58,237,0.6)] transition-colors w-52"
          />
        </div>
        <div className="flex items-center gap-2">
          {Object.entries(CONCEPT_COLORS).map(([type, color]) => (
            <button
              key={type}
              onClick={() => setFilter(filter === type ? null : type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all border ${filter === type ? "text-white" : "text-[#64748b] hover:text-white"}`}
              style={{
                borderColor: filter === type ? color : "rgba(124,58,237,0.2)",
                background: filter === type ? `${color}20` : "transparent",
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Graph canvas */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 rounded-2xl overflow-hidden border border-[rgba(124,58,237,0.2)]"
        style={{ minHeight: "500px" }}
      >
        <ReactFlowComponent
          nodes={filteredNodes}
          edges={edges.map((e) => ({
            ...e,
            style: { stroke: "rgba(124,58,237,0.5)", strokeWidth: 1.5 },
            labelStyle: { fill: "#64748b", fontSize: 10 },
            labelBgStyle: { fill: "rgba(5,8,22,0.8)" },
          }))}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(_: React.MouseEvent, node: Node) => setSelectedNode(node)}
          fitView
          attributionPosition="bottom-left"
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1}
            color="rgba(124,58,237,0.15)"
            style={{ background: "#050816" }}
          />
          <Controls
            style={{
              background: "rgba(13,20,64,0.9)",
              border: "1px solid rgba(124,58,237,0.2)",
              borderRadius: "12px",
            }}
          />
          <MiniMap
            style={{
              background: "rgba(5,8,22,0.9)",
              border: "1px solid rgba(124,58,237,0.2)",
              borderRadius: "12px",
            }}
            nodeColor={(n) => CONCEPT_COLORS[(n.data as any).type] ?? "#7c3aed"}
          />
        </ReactFlowComponent>
      </motion.div>

      {/* Node detail panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-24 right-8 w-72 glass-bright rounded-2xl p-5 border border-[rgba(124,58,237,0.3)] z-10"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                  style={{
                    background: `${CONCEPT_COLORS[(selectedNode.data as any).type] ?? "#7c3aed"}20`,
                    color: CONCEPT_COLORS[(selectedNode.data as any).type] ?? "#7c3aed",
                  }}
                >
                  {(selectedNode.data as any).type}
                </span>
                <h3 className="text-white font-semibold mt-2">{(selectedNode.data as any).label as string}</h3>
              </div>
              <button onClick={() => setSelectedNode(null)} className="text-[#64748b] hover:text-white transition-colors text-lg leading-none">×</button>
            </div>
            <p className="text-sm text-[#a8b2d8]">{(selectedNode.data as any).description as string}</p>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 text-xs py-2 rounded-xl bg-[rgba(124,58,237,0.2)] border border-[rgba(124,58,237,0.3)] text-[#a78bfa] hover:bg-[rgba(124,58,237,0.3)] transition-colors">
                Expand Node
              </button>
              <button className="flex-1 text-xs py-2 rounded-xl bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] text-[#10b981] hover:bg-[rgba(16,185,129,0.2)] transition-colors">
                Generate Flashcard
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
