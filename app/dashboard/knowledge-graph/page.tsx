"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ReactFlow as ReactFlowComponent, Node, Edge, Background, Controls, MiniMap,
  addEdge, useNodesState, useEdgesState, Connection,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Search, RefreshCw, Sparkles, X } from "lucide-react";
import { B } from "@/lib/bauhaus";

const CONCEPT_COLORS: Record<string, string> = {
  concept: "#1040C0",       // Blue
  entity: "#D02020",        // Red
  topic: "#F0C020",         // Yellow
  technology: "#121212",    // Black
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
  background: "#ffffff",
  border: "2px solid #121212",
  borderRadius: "0px",
  padding: "10px 16px",
  color: "#121212",
  fontSize: "12px",
  fontWeight: 800,
  boxShadow: "3px 3px 0px 0px #121212",
  fontFamily: "'Outfit', sans-serif",
  textTransform: "uppercase" as const,
  width: "180px",
  textAlign: "center" as const,
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

  const filteredNodes = nodes.map((n) => {
    const isSelected = selectedNode?.id === n.id;
    const typeColor = CONCEPT_COLORS[(n.data as any).type] ?? "#1040C0";
    return {
      ...n,
      style: {
        ...nodeStyles,
        border: isSelected ? `3px solid ${typeColor}` : `2px solid #121212`,
        borderTop: `6px solid ${typeColor}`,
        boxShadow: isSelected ? "5px 5px 0px 0px #121212" : "3px 3px 0px 0px #121212",
        opacity:
          (search && !(n.data as any).label.toLowerCase().includes(search.toLowerCase())) ||
          (filter && (n.data as any).type !== filter)
            ? 0.2
            : 1,
      },
    };
  });

  return (
    <div className="h-full flex flex-col gap-6 max-w-7xl mx-auto pb-6 relative">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
        <div>
          <h1 className="font-display text-4xl font-black uppercase tracking-tight text-[#121212]" style={B.displayStyle}>
            Knowledge Graph
          </h1>
          <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mt-1" style={B.labelStyle}>
            {nodes.length} concepts · {edges.length} relationships
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setNodes(INITIAL_NODES);
              setEdges(INITIAL_EDGES);
              setSelectedNode(null);
            }}
            id="regenerate-graph-button"
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-[#121212] text-[#121212] font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_#121212] hover:bg-gray-50 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#121212] transition-all cursor-pointer rounded-none"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            <RefreshCw className="w-4 h-4 text-[#121212]" />
            Regenerate
          </button>
          <button
            id="expand-graph-button"
            className="inline-flex items-center justify-center gap-2 bg-[#D02020] text-white border-2 border-[#121212] font-black uppercase tracking-wider text-xs shadow-[3px_3px_0px_0px_#121212] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#121212] transition-all cursor-pointer rounded-none px-4 py-2.5"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            <Sparkles className="w-4 h-4 text-white" />
            AI Expand
          </button>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex flex-col md:flex-row md:items-center gap-4 shrink-0">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#121212]" />
          <input
            id="graph-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search concepts..."
            className="w-full pl-9 pr-4 py-2.5 border-2 border-[#121212] bg-white text-[#121212] placeholder-gray-400 text-sm font-semibold rounded-none focus:outline-none focus:bg-gray-50 shadow-[3px_3px_0px_0px_#121212]"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(CONCEPT_COLORS).map(([type, color]) => {
            const isActive = filter === type;
            return (
              <button
                key={type}
                onClick={() => setFilter(filter === type ? null : type)}
                className="px-3.5 py-1.5 border-2 border-[#121212] font-black uppercase text-[10px] tracking-wider transition-all cursor-pointer rounded-none shadow-[2px_2px_0px_0px_#121212] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#121212]"
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  background: isActive ? color : "transparent",
                  color: isActive ? (type === "topic" ? "#121212" : "#ffffff") : "#121212",
                }}
              >
                {type}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Graph canvas */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex-1 border-4 border-[#121212] shadow-[8px_8px_0px_0px_#121212] rounded-none bg-[#F0F0F0]"
        style={{ minHeight: "500px" }}
      >
        <ReactFlowComponent
          nodes={filteredNodes}
          edges={edges.map((e) => ({
            ...e,
            style: { stroke: "#121212", strokeWidth: 2 },
            labelStyle: { fill: "#121212", fontSize: 10, fontWeight: "bold", fontFamily: "'Outfit', sans-serif" },
            labelBgStyle: { fill: "#ffffff", stroke: "#121212", strokeWidth: 1 },
            labelBgPadding: [6, 4],
            labelBgBorderRadius: 0,
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
            size={1.5}
            color="#12121220"
            style={{ background: "#F0F0F0" }}
          />
          <Controls
            style={{
              background: "#ffffff",
              border: "2px solid #121212",
              borderRadius: "0px",
              boxShadow: "3px 3px 0px 0px #121212",
              display: "flex",
              flexDirection: "column",
            }}
          />
          <MiniMap
            style={{
              background: "#ffffff",
              border: "2px solid #121212",
              borderRadius: "0px",
              boxShadow: "4px 4px 0px 0px #121212",
            }}
            nodeColor={(n) => CONCEPT_COLORS[(n.data as any).type] ?? "#121212"}
            maskColor="rgba(240, 240, 240, 0.6)"
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
            className="absolute top-36 right-6 w-80 bg-white border-4 border-[#121212] p-5 shadow-[6px_6px_0px_0px_#121212] rounded-none z-10"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <span
                  className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 border border-[#121212] rounded-none"
                  style={{
                    background: CONCEPT_COLORS[(selectedNode.data as any).type] ?? "#1040C0",
                    color: (selectedNode.data as any).type === "topic" ? "#121212" : "#ffffff",
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  {(selectedNode.data as any).type}
                </span>
                <h3 className="text-[#121212] font-black mt-2 text-xl uppercase tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {(selectedNode.data as any).label as string}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 border border-[#121212] bg-white text-[#121212] hover:bg-[#D02020] hover:text-white transition-all cursor-pointer rounded-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm font-semibold text-gray-700 leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {(selectedNode.data as any).description as string}
            </p>
            <div className="mt-6 flex gap-3 border-t-2 border-dashed border-[#121212] pt-4">
              <button
                className="flex-1 text-[10px] font-black uppercase tracking-wider py-2.5 bg-[#1040C0] text-white border-2 border-[#121212] shadow-[2px_2px_0px_0px_#121212] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#121212] transition-all cursor-pointer rounded-none"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Expand Node
              </button>
              <button
                className="flex-1 text-[10px] font-black uppercase tracking-wider py-2.5 bg-[#F0C020] text-[#121212] border-2 border-[#121212] shadow-[2px_2px_0px_0px_#121212] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#121212] transition-all cursor-pointer rounded-none"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Generate Card
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
