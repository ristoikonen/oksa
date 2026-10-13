import React, { useEffect, useRef } from "react";

interface CanvasBranchyProps {
  text: string;
}

export function CanvasBranchy({ text }: CanvasBranchyProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 300;
    canvas.width = size;
    canvas.height = size;

    // 1. Pure white canvas background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);

    // Generate deterministic nodes from string character codes
    const points: { x: number; y: number }[] = [];
    const numPoints = Math.max(6, text.length * 2);

    for (let i = 0; i < numPoints; i++) {
      const charCode = text.charCodeAt(i % (text.length || 1)) || 65;
      const x = ((Math.sin(charCode * (i + 1)) + 1) / 2) * (size - 100) + 50;
      const y = ((Math.cos(charCode * (i + 1)) + 1) / 2) * (size - 100) + 50;
      points.push({ x, y });
    }

    // 2. Natural Branch styling: dark gray / black thick lines with rounded caps
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    if (points.length > 0) {
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
        // Create secondary branch links
        if (i % 2 === 0 && i > 1) {
          ctx.moveTo(points[i - 2].x, points[i - 2].y);
          ctx.lineTo(points[i].x, points[i].y);
        }
      }
    }
    ctx.stroke();

    // 3. Draw branch nodes/joints with inverted core
    points.forEach((p, idx) => {
      ctx.fillStyle = "#1a1a1a";
      ctx.beginPath();
      ctx.arc(p.x, p.y, idx === 0 ? 5.5 : 4, 0, Math.PI * 2);
      ctx.fill();

      // Inner white core for organic depth
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [text]);

  return (
    <div className="flex items-center justify-center w-full h-full p-4">
      <canvas
        ref={canvasRef}
        className="w-[240px] h-[240px] border border-white/20 bg-white shadow-2xl block"
      />
    </div>
  );
}