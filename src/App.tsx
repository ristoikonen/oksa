import React, { useState } from "react";
import { Canvas2D } from "./components/Canvas2D";
import { CanvasBranchy } from "./components/CanvasBranchy";
import { Viewer3D } from "./components/Viewer3D";
import { BidirectionalBridge } from "./components/BidirectionalBridge";

export default function App() {
  const [inputVal, setInputVal] = useState<string>("OKSA-01");
  const [viewMode, setViewMode] = useState<"split" | "2d" | "3d" | "branchy" | "2way">("2way");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.toUpperCase().slice(0, 9);
    setInputVal(cleaned);
  };

  const isBranchy = viewMode === "branchy";
  const is2Way = viewMode === "2way";

  return (
    <main
      className={`min-h-screen flex flex-col justify-between p-8 transition-colors duration-300 ${
        isBranchy ? "bg-white text-black selection:bg-black selection:text-white" : "bg-[#050505] text-white selection:bg-white selection:text-black"
      }`}
    >
      {/* Header */}
      <header
        className={`flex justify-between items-center border-b pb-6 flex-wrap gap-4 ${
          isBranchy ? "border-black/10" : "border-white/10"
        }`}
      >
        <div>
          <h1 className="text-xl tracking-widest font-light">OKSA // ID</h1>
          <p className={`text-xs tracking-wider mt-1 ${isBranchy ? "text-black/50" : "text-white/40"}`}>
            BI-DIRECTIONAL IDENTITY MATRIX [GLOW2]
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["split", "2d", "branchy", "3d", "2way"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 text-xs tracking-widest border transition-all cursor-pointer ${
                viewMode === mode
                  ? isBranchy
                    ? "border-black bg-black text-white font-medium"
                    : "border-white bg-white text-black font-medium"
                  : isBranchy
                  ? "border-black/20 text-black/70 hover:border-black/60"
                  : "border-white/20 text-white/60 hover:border-white/60"
              }`}
            >
              {mode.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      {/* Main Workspace */}
      <section className="my-auto py-12 flex flex-col items-center w-full max-w-4xl mx-auto">
        <div className="w-full max-w-md mb-12">
          <label className={`block text-xs uppercase tracking-widest mb-3 ${isBranchy ? "text-black/60" : "text-white/50"}`}>
            Identity String (Max 9 Chars)
          </label>
          <input
            type="text"
            value={inputVal}
            onChange={handleInputChange}
            placeholder="ENTER STRING"
            className={`w-full bg-transparent border px-6 py-4 text-center tracking-[0.5em] text-xl focus:outline-none transition-colors ${
              isBranchy
                ? "border-black/30 text-black focus:border-black"
                : "border-white/20 text-white focus:border-white"
            }`}
          />
          <div className={`flex justify-between text-[10px] tracking-widest mt-2 px-1 ${isBranchy ? "text-black/40" : "text-white/30"}`}>
            <span>SPARSE ENCODING</span>
            <span>{inputVal.length} / 9 CHARS</span>
          </div>
        </div>

        {/* Visualizers Container */}
        {is2Way ? (
          <BidirectionalBridge text={inputVal} />
        ) : (
          <div
            className={`grid gap-8 w-full ${
              viewMode === "split"
                ? "grid-cols-1 md:grid-cols-2 max-w-2xl"
                : "grid-cols-1 max-w-md mx-auto"
            }`}
          >
            {/* 2D Orthogonal Matrix */}
            {(viewMode === "split" || viewMode === "2d") && (
              <div className="border border-white/10 bg-white/[0.01] p-6 flex flex-col items-center justify-center relative aspect-square">
                <span className="absolute top-4 left-4 text-[10px] uppercase tracking-widest text-white/40">
                  Matrix 2D // Orthogonal
                </span>
                <Canvas2D text={inputVal} />
              </div>
            )}

            {/* Branchy Vector Graph */}
            {viewMode === "branchy" && (
              <div className="bg-black border border-black p-6 flex flex-col items-center justify-center relative aspect-square shadow-2xl">
                <span className="absolute top-4 left-4 text-[10px] uppercase tracking-widest text-white/60">
                  Matrix Graph // Oksa (Branchy)
                </span>
                <CanvasBranchy text={inputVal} />
              </div>
            )}

            {/* 3D Kinetic View */}
            {(viewMode === "split" || viewMode === "3d") && (
              <div className="border border-white/10 bg-white/[0.01] p-6 flex flex-col items-center justify-center relative aspect-square">
                <span className="absolute top-4 left-4 text-[10px] uppercase tracking-widest text-white/40">
                  {viewMode === "3d" ? "Matrix 3D // Kinetic" : "Matrix 3D // Volumetric"}
                </span>
                <Viewer3D text={inputVal} autoRotate={true} />
              </div>
            )}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className={`border-t pt-6 flex justify-between text-xs tracking-wider ${isBranchy ? "border-black/10 text-black/40" : "border-white/10 text-white/40"}`}>
        <span>POWERED BY VITE & BUN</span>
        <span>WHITE & SPARSE</span>
      </footer>
    </main>
  );
}