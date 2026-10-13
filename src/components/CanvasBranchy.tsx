import React, { useEffect, useRef } from "react";

export type BranchStyle = "knotty" | "thin" | "steel";
export type ScaleSize = "normal" | "small" | "xsmall";

interface CanvasBranchyProps {
  text: string;
  branchStyle?: BranchStyle;
  scale?: ScaleSize;
}

export function CanvasBranchy({ text, branchStyle = "knotty", scale = "normal" }: CanvasBranchyProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = scale === "xsmall" ? 120 : scale === "small" ? 180 : 300;
    canvas.width = size;
    canvas.height = size;

    // 1. Pure white canvas background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);

    // Generate stable deterministic nodes from string
    const points: { x: number; y: number }[] = [];
    const numPoints = Math.max(6, text.length * 2);

    const padding = scale === "xsmall" ? 20 : scale === "small" ? 30 : 50;
    const usableSize = size - padding * 2;

    for (let i = 0; i < numPoints; i++) {
      const charCode = text.charCodeAt(i % (text.length || 1)) || 65;
      const x = ((Math.sin(charCode * (i + 1)) + 1) / 2) * usableSize + padding;
      const y = ((Math.cos(charCode * (i + 1)) + 1) / 2) * usableSize + padding;
      points.push({ x, y });
    }

    const scaleFactor = size / 300;

    // Helper for connecting lines
    const drawConnections = (strokeColor: string, width: number, lineCap: CanvasLineCap = "round") => {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = Math.max(0.6, width * scaleFactor);
      ctx.lineCap = lineCap;
      ctx.lineJoin = "round";

      ctx.beginPath();
      if (points.length > 0) {
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
          if (i % 2 === 0 && i > 1) {
            ctx.moveTo(points[i - 2].x, points[i - 2].y);
            ctx.lineTo(points[i].x, points[i].y);
          }
        }
      }
      ctx.stroke();
    };

    // 2. Render based on active BranchStyle
    if (branchStyle === "knotty") {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let i = 0; i < points.length; i++) {
        const p1 = points[i];

        if (i + 1 < points.length) {
          const p2 = points[i + 1];
          const cpX = (p1.x + p2.x) / 2 + (i % 2 === 0 ? 8 : -8) * scaleFactor;
          const cpY = (p1.y + p2.y) / 2 + (i % 3 === 0 ? -8 : 8) * scaleFactor;

          const baseW = scale === "xsmall" ? 1.5 : scale === "small" ? 2.5 : 3.6;
          ctx.strokeStyle = "#1a1a1a";
          ctx.lineWidth = Math.max(1, (baseW + Math.sin(i * 0.9) * 0.4) * scaleFactor);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.quadraticCurveTo(cpX, cpY, p2.x, p2.y);
          ctx.stroke();

          if (scale !== "xsmall" && i % 2 === 0) {
            const midT = 0.5;
            const mx = (1 - midT) * (1 - midT) * p1.x + 2 * (1 - midT) * midT * cpX + midT * midT * p2.x;
            const my = (1 - midT) * (1 - midT) * p1.y + 2 * (1 - midT) * midT * cpY + midT * midT * cpY; // wait, let's keep correct my calculation:
            // Correct my calculation below:
            const myCorrect = (1 - midT) * (1 - midT) * p1.y + 2 * (1 - midT) * midT * cpY + midT * midT * p2.y;

            ctx.fillStyle = "#1a1a1a";
            ctx.beginPath();
            ctx.arc(mx, myCorrect, 1.8 * scaleFactor, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      points.forEach((p, idx) => {
        const radius = (idx === 0 ? 4.8 : 3.6) * scaleFactor;
        ctx.fillStyle = "#1a1a1a";
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1.5, radius), 0, Math.PI * 2);
        ctx.fill();

        if (scale !== "xsmall") {
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.8, radius - 1.5 * scaleFactor), 0, Math.PI * 2);
          ctx.fill();
        }
      });
    } else if (branchStyle === "thin") {
      // --- ULTRA THIN ---
      drawConnections("#222222", 0.9, "square");
      points.forEach((p, idx) => {
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, 2 * scaleFactor), 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (branchStyle === "steel") {
      // --- STEEL FRAME ---
      drawConnections("#333333", 4, "butt");
      drawConnections("#999999", 1.4, "butt");

      points.forEach((p) => {
        const s = Math.max(4, 7 * scaleFactor);
        ctx.fillStyle = "#111111";
        ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = Math.max(0.8, 1 * scaleFactor);
        ctx.strokeRect(p.x - s / 2 + 1, p.y - s / 2 + 1, s - 2, s - 2);
      });
    }
  }, [text, branchStyle, scale]);

  const cssSize = scale === "xsmall" ? "w-[100px] h-[100px]" : scale === "small" ? "w-[160px] h-[160px]" : "w-[240px] h-[240px]";

  return (
    <div className="flex items-center justify-center w-full h-full p-2">
      <canvas
        ref={canvasRef}
        className={`${cssSize} border border-white/20 bg-white shadow-xl block`}
      />
    </div>
  );
}