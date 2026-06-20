"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ReactFlow, Background, Controls, MiniMap, type Node, type Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { B } from "@/lib/bauhaus";

const demoNodes: Node[] = [
  { id: "1", position: { x: 400, y: 200 }, data: { label: "Artificial Intelligence" }, style: { background: "#ffffff", border: "1px solid #ffffff", color: "#000000", borderRadius: "12px", padding: "10px 16px", fontWeight: 600, fontSize: "13px", boxShadow: "0 0 20px rgba(255,255,255,0.2)" } },
  { id: "2", position: { x: 150, y: 350 }, data: { label: "Machine Learning" }, style: { background: "#111111", border: "1px solid #444444", color: "#e2e8f0", borderRadius: "12px", padding: "8px 14px", fontSize: "12px" } },
  { id: "3", position: { x: 650, y: 350 }, data: { label: "Deep Learning" }, style: { background: "#111111", border: "1px solid #444444", color: "#e2e8f0", borderRadius: "12px", padding: "8px 14px", fontSize: "12px" } },
  { id: "4", position: { x: 50, y: 500 }, data: { label: "Neural Networks" }, style: { background: "#0a0a0a", border: "1px solid #333333", color: "#a1a1aa", borderRadius: "10px", padding: "6px 12px", fontSize: "12px" } },
  { id: "5", position: { x: 280, y: 500 }, data: { label: "Random Forest" }, style: { background: "#0a0a0a", border: "1px solid #333333", color: "#a1a1aa", borderRadius: "10px", padding: "6px 12px", fontSize: "12px" } },
  { id: "6", position: { x: 550, y: 500 }, data: { label: "Transformers" }, style: { background: "#0a0a0a", border: "1px solid #333333", color: "#a1a1aa", borderRadius: "10px", padding: "6px 12px", fontSize: "12px" } },
  { id: "7", position: { x: 770, y: 500 }, data: { label: "GPT Architecture" }, style: { background: "#0a0a0a", border: "1px solid #333333", color: "#a1a1aa", borderRadius: "10px", padding: "6px 12px", fontSize: "12px" } },
  { id: "8", position: { x: 400, y: 60 }, data: { label: "Computer Science" }, style: { background: "transparent", border: "1px dashed #444444", color: "#71717a", borderRadius: "10px", padding: "6px 12px", fontSize: "11px" } },
];

const demoEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", label: "includes", animated: true, style: { stroke: "#a1a1aa", strokeWidth: 1.5 }, labelStyle: { fill: "#71717a", fontSize: "10px" } },
  { id: "e1-3", source: "1", target: "3", label: "includes", animated: true, style: { stroke: "#a1a1aa", strokeWidth: 1.5 }, labelStyle: { fill: "#71717a", fontSize: "10px" } },
  { id: "e2-4", source: "2", target: "4", label: "uses", animated: false, style: { stroke: "#444444", strokeWidth: 1 }, labelStyle: { fill: "#71717a", fontSize: "10px" } },
  { id: "e2-5", source: "2", target: "5", label: "includes", style: { stroke: "#444444", strokeWidth: 1 }, labelStyle: { fill: "#71717a", fontSize: "10px" } },
  { id: "e3-6", source: "3", target: "6", label: "uses", animated: true, style: { stroke: "#666666", strokeWidth: 1 }, labelStyle: { fill: "#71717a", fontSize: "10px" } },
  { id: "e6-7", source: "6", target: "7", label: "enables", style: { stroke: "#444444", strokeWidth: 1 }, labelStyle: { fill: "#71717a", fontSize: "10px" } },
  { id: "e8-1", source: "8", target: "1", label: "includes", style: { stroke: "#333333", strokeWidth: 1, strokeDasharray: "4 4" }, labelStyle: { fill: "#71717a", fontSize: "10px" } },
];

export function KnowledgeGraphDemo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="landing-section" style={{ background: B.BLACK }}>
      <div className="absolute inset-0 bg-dot-grid-white opacity-10 pointer-events-none" />

      <div className="site-shell relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <span className="section-label mb-4 block" style={{ color: B.YELLOW }}>
            Knowledge Graph
          </span>
          <h2 className="section-heading mb-4 text-white">
            Watch Your Knowledge{" "}
            <span className="text-[#a1a1aa]">Come Alive</span>
          </h2>
          <p className="text-lg text-[#a1a1aa] max-w-2xl">
            AI automatically extracts concepts from your documents and builds an
            interactive knowledge universe you can explore.
          </p>
        </motion.div>

        {/* Graph Demo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="overflow-hidden"
          style={{ height: "clamp(420px, 55vw, 560px)", border: "3px solid white", boxShadow: "6px 6px 0px 0px #ffffff", background: "#0a0a0a" }}
        >
          {/* Fake toolbar */}
          <div className="px-4 py-3 border-b border-[#333] flex items-center gap-3 bg-[#0a0a0a]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#333]" />
              <div className="w-3 h-3 rounded-full bg-[#333]" />
              <div className="w-3 h-3 rounded-full bg-[#333]" />
            </div>
            <span className="text-sm text-[#71717a] ml-2">Knowledge Graph — AI Textbook.pdf</span>
            <span className="ml-auto text-xs text-white font-medium px-2 py-1 bg-[#222] rounded-md">8 concepts extracted</span>
          </div>

          <ReactFlow
            nodes={demoNodes}
            edges={demoEdges}
            fitView
            proOptions={{ hideAttribution: true }}
            nodesDraggable={true}
            nodesConnectable={false}
          >
            <Background color="#1a1a1a" gap={24} />
            <Controls showInteractive={false} />
            <MiniMap
              nodeColor={(n) =>
                (n.style?.borderColor as string) ?? "#333"
              }
              maskColor="rgba(0,0,0,0.8)"
            />
          </ReactFlow>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-sm text-[#777] mt-5"
        >
          ↑ Interactive demo — drag nodes, zoom, and pan to explore
        </motion.p>
      </div>
    </section>
  );
}
