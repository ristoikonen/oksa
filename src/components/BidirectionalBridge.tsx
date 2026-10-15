import React, { useMemo, useRef, useState } from "react";
import { Button } from "./ui/button";

interface BidirectionalBridgeProps {
  text: string;
}

export function BidirectionalBridge({ text }: BidirectionalBridgeProps) {
  const [glbStatus, setGlbStatus] = useState<{
    fileName: string;
    identifier: string | null;
    loading: boolean;
    error: string | null;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadRequest = useRef(0);

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

  async function handleGlbSelection(file: File | undefined) {
    if (!file) return;
    const requestId = ++uploadRequest.current;
    setGlbStatus({ fileName: file.name, identifier: null, loading: true, error: null });
    try {
      const { getRisukkoIdentifier, parseGlbFile } = await import("../lib/glb");
      const gltf = await parseGlbFile(file);
      if (requestId !== uploadRequest.current) return;
      setGlbStatus({
        fileName: file.name,
        identifier: getRisukkoIdentifier(gltf),
        loading: false,
        error: null,
      });
    } catch (cause) {
      if (requestId !== uploadRequest.current) return;
      setGlbStatus({
        fileName: file.name,
        identifier: null,
        loading: false,
        error: cause instanceof Error ? cause.message : "Could not read this GLB model.",
      });
    }
  }

  const isSynced = glbStatus?.identifier !== null && glbStatus?.identifier === text;
  const statusText = glbStatus?.loading
    ? `READING ${glbStatus.fileName}`
    : glbStatus?.error
      ? "GLB ERROR"
      : isSynced
        ? `SYNCED WITH ${glbStatus.fileName}`
        : glbStatus?.identifier
          ? `MISMATCH WITH ${glbStatus.fileName}`
          : glbStatus?.fileName
            ? `UNVERIFIED WITH ${glbStatus.fileName}`
            : "NO GLB SELECTED";
  const statusColor = glbStatus?.error
    ? "text-red-700"
    : isSynced
      ? "text-emerald-700"
      : glbStatus?.identifier || glbStatus?.fileName
        ? "text-amber-700"
        : "text-muted-foreground";
  const statusDotColor = glbStatus?.error
    ? "bg-red-500"
    : isSynced
      ? "bg-emerald-500"
      : glbStatus?.identifier || glbStatus?.fileName
        ? "bg-amber-500"
        : "bg-slate-300";

  return (
    <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-4 font-mono text-xs text-foreground shadow-sm sm:p-6">
      <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
        <span className="tracking-widest uppercase text-muted-foreground">[RISUKKO]</span>
        <span className={`inline-flex items-center gap-2 tracking-wider ${statusColor}`}>
          <span className={`size-2 rounded-full ${statusDotColor}`} aria-hidden="true" />
          {statusText}
        </span>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Button onClick={() => inputRef.current?.click()} size="sm" variant="outline">
          {glbStatus?.fileName ? "Choose another GLB" : "Check GLB sync"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept=".glb,model/gltf-binary"
          className="sr-only"
          onChange={(event) => {
            void handleGlbSelection(event.currentTarget.files?.[0]);
            event.currentTarget.value = "";
          }}
        />
        {glbStatus?.identifier && !glbStatus.loading && (
          <span className="text-xs text-muted-foreground">
            GLB identifier: <strong className="font-semibold text-foreground">{glbStatus.identifier}</strong>
          </span>
        )}
        {glbStatus?.error && (
          <span className="text-xs text-red-700" role="alert">{glbStatus.error}</span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Forward Stream */}
        <div className="space-y-3">
          <div className="text-[10px] tracking-widest uppercase text-muted-foreground" />
          <div className="border border-border bg-slate-50 p-3">
            <div className="mb-1 text-[10px] text-muted-foreground">INPUT PAYLOAD</div>
            <div className="text-lg tracking-[0.3em] font-light">
              {text.padEnd(9, "·")}
            </div>
          </div>
        </div>

        {/* Reverse Stream */}
        <div className="space-y-3">
          <div className="text-[10px] tracking-widest uppercase text-muted-foreground" />
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
        <div className="overflow-x-auto border border-border">
          <div className="ml-2 mb-2 mt-2 text-[10px] text-muted-foreground">CHARACTER MATRIX</div>
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