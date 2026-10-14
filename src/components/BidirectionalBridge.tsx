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
    <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-4 font-mono text-xs text-foreground shadow-sm sm:p-6">
      <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
        <span className="tracking-widest uppercase text-muted-foreground">
          Bi-Directional Pipeline [2WAY-OKSA]
        </span>
        <span className="tracking-wider text-emerald-700">● SYNCED</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Forward Stream */}
        <div className="space-y-3">
          <div className="text-[10px] tracking-widest uppercase text-muted-foreground">
            01 // Forward Encoding (String $\rightarrow$ Matrix)
          </div>
          <div className="border border-border bg-slate-50 p-3">
            <div className="mb-1 text-[10px] text-muted-foreground">INPUT PAYLOAD</div>
            <div className="text-lg tracking-[0.3em] font-light">
              {text.padEnd(9, "·")}
            </div>
          </div>
        </div>

        {/* Reverse Stream */}
        <div className="space-y-3">
          <div className="text-[10px] tracking-widest uppercase text-muted-foreground">
            02 // Reverse Decoding (Matrix $\rightarrow$ String)
          </div>
          <div className="border border-border bg-blue-50/70 p-3">
            <div className="mb-1 text-[10px] text-muted-foreground">RECONSTRUCTED HASH</div>
            <div className="text-lg tracking-[0.3em] font-light text-blue-800">
              {decodedString || "NULL"}
            </div>
          </div>
        </div>
      </div>

      {/* Node Mapping Table */}
      <div className="mt-8">
        <div className="mb-3 text-[10px] tracking-widest uppercase text-muted-foreground">
          03 // Deterministic Node Correspondence Matrix
        </div>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-slate-50 text-[10px] text-muted-foreground">
                <th className="p-2">IDX</th>
                <th className="p-2">CHAR</th>
                <th className="p-2">HEX VALUE</th>
                <th className="p-2">VECTOR STATE</th>
              </tr>
            </thead>
            <tbody>
              {encodedNodes.map((node) => (
                <tr key={node.index} className="border-b border-border/70 transition-colors last:border-0 hover:bg-slate-50">
                  <td className="p-2 text-muted-foreground">#{node.index + 1}</td>
                  <td className="p-2 font-bold">{node.char}</td>
                  <td className="p-2 text-blue-700">{node.hex}</td>
                  <td className="p-2 text-muted-foreground">{node.bitweight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}