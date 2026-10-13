import React, { useEffect, useRef } from "react";

interface Canvas2DProps {
  text: string;
}

export function Canvas2D({ text }: Canvas2DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set drawing buffer size for high-res crispness
    const size = 300;
    canvas.width = size;
    canvas.height = size;

    // Clear and fill solid black background
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, size, size);

    // Generate Sparse Matrix Grid
    const gridRows = 9;
    const cellSize = size / gridRows;

    ctx.fillStyle = "#ffffff";

    for (let i = 0; i < gridRows; i++) {
      for (let j = 0; j < gridRows; j++) {
        const charCode = text.charCodeAt((i + j) % (text.length || 1)) || 32;
        const bit = (charCode + i * j) % 3 === 0;

        // Draw sparse blocks with a small padding for grid gaps
        if (bit || i === 0 || i === gridRows - 1 || j === 0 || j === gridRows - 1) {
          ctx.fillRect(j * cellSize + 4, i * cellSize + 4, cellSize - 8, cellSize - 8);
        }
      }
    }
  }, [text]);

  return (
    <div className="flex items-center justify-center w-full h-full p-4">
      <canvas
        ref={canvasRef}
        className="w-[240px] h-[240px] border border-white/30 bg-black shadow-2xl block"
      />
    </div>
  );
}