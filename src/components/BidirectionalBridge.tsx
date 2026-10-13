import React, { useMemo } from "react";

interface BidirectionalBridgeProps {
  text: string;
}

export function BidirectionalBridge({ text }: BidirectionalBridgeProps) {
  // 1. Forward Encoding: String to Matrix Nodes
  const encodedNodes = useMemo(() => {
    const nodes = [];
    const maxChars = 9;
    for (let i = 0; i < maxChars; i++) {
      const char = text[i] || "·";
      const charCode = text.charCodeAt(i) || 0;
      nodes.push({
        index: i,
        char,
        hex: charCode ? `0x${charCode.toString(16).toUpperCase()}` : "0x00",
        bitweight: charCode ? (charCode % 3 === 0 ? "HIGH" : "LOW") : "NULL",
      });
    }
    return nodes;
  }, [text]);

  // 2. Reverse Decoding simulation: Reconstructing identity from node weights
  const decodedString = useMemo(() => {
    return encodedNodes
      .map((n) => (n.char !== "·" ? n.char : ""))
      .join("");
  }, [encodedNodes]);

  return (
    <div className="w-full max-w-2xl border border-white/20 bg-black p-6 font-mono text-xs text-white">
      <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
        <span className="tracking-widest uppercase text-white/50">
          Bi-Directional Pipeline [2WAY-OKSA]
        </span>
        <span className="text-emerald-400 tracking-wider">● SYNCED</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Forward Stream */}
        <div className="space-y-3">
          <div className="text-[10px] text-white/40 tracking-widest uppercase">
            01 // Forward Encoding (String $\rightarrow$ Matrix)
          </div>
          <div className="p-3 border border-white/10 bg-white/[0.02]">
            <div className="text-white/50 text-[10px] mb-1">INPUT PAYLOAD</div>
            <div className="text-lg tracking-[0.3em] font-light">
              {text.padEnd(9, "·")}
            </div>
          </div>
        </div>

        {/* Reverse Stream */}
        <div className="space-y-3">
          <div className="text-[10px] text-white/40 tracking-widest uppercase">
            02 // Reverse Decoding (Matrix $\rightarrow$ String)
          </div>
          <div className="p-3 border border-white/10 bg-white/[0.02]">
            <div className="text-white/50 text-[10px] mb-1">RECONSTRUCTED HASH</div>
            <div className="text-lg tracking-[0.3em] font-light text-white/90">
              {decodedString || "NULL"}
            </div>
          </div>
        </div>
      </div>

      {/* Node Mapping Table */}
      <div className="mt-8">
        <div className="text-[10px] text-white/40 tracking-widest uppercase mb-3">
          03 // Deterministic Node Correspondence Matrix
        </div>
        <div className="border border-white/10 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-[10px]">
                <th className="p-2">IDX</th>
                <th className="p-2">CHAR</th>
                <th className="p-2">HEX VALUE</th>
                <th className="p-2">VECTOR STATE</th>
              </tr>
            </thead>
            <tbody>
              {encodedNodes.map((node) => (
                <tr key={node.index} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="p-2 text-white/30">#{node.index + 1}</td>
                  <td className="p-2 font-bold">{node.char}</td>
                  <td className="p-2 text-white/70">{node.hex}</td>
                  <td className="p-2 text-white/50">{node.bitweight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}