import React, { useEffect, useRef } from "react";

export type BranchStyle = "knotty" | "thin" | "steel";

interface CanvasBranchyProps {
  text: string;
  branchStyle?: BranchStyle;
}

export function CanvasBranchy({ text, branchStyle = "knotty" }: CanvasBranchyProps) {
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

    // Generate stable deterministic nodes from string
    const points: { x: number; y: number }[] = [];
    const numPoints = Math.max(6, text.length * 2);

    for (let i = 0; i < numPoints; i++) {
      const charCode = text.charCodeAt(i % (text.length || 1)) || 65;
      const x = ((Math.sin(charCode * (i + 1)) + 1) / 2) * (size - 100) + 50;
      const y = ((Math.cos(charCode * (i + 1)) + 1) / 2) * (size - 100) + 50;
      points.push({ x, y });
    }

    // Helper for thin style
    const drawConnections = (strokeColor: string, width: number, lineCap: CanvasLineCap = "square") => {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = width;
      ctx.lineCap = lineCap;
      ctx.lineJoin = "round";

      const firstPoint = points[0];
      if (!firstPoint) {
        return;
      }

      ctx.beginPath();
      ctx.moveTo(firstPoint.x, firstPoint.y);
      for (let i = 1; i < points.length; i++) {
        const currentPoint = points[i];
        if (!currentPoint) {
          continue;
        }

        ctx.lineTo(currentPoint.x, currentPoint.y);
        if (i % 2 === 0 && i > 1) {
          const previousPoint = points[i - 2];
          if (!previousPoint) {
            continue;
          }

          ctx.moveTo(previousPoint.x, previousPoint.y);
          ctx.lineTo(currentPoint.x, currentPoint.y);
        }
      }
      ctx.stroke();
    };

    // 2. Render selected Branch Style
    if (branchStyle === "knotty") {
      // --- KNOTTY TREE BRANCH (Smooth Curves, Subtle Width Diff & Tiny Bulges) ---
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        if (!p1) continue;

        if (i + 1 < points.length) {
          const p2 = points[i + 1];
          if (!p2) continue;

          // Gentle control point for smooth, elegant natural curves
          const cpX = (p1.x + p2.x) / 2 + (i % 2 === 0 ? 8 : -8);
          const cpY = (p1.y + p2.y) / 2 + (i % 3 === 0 ? -8 : 8);

          // Small, smooth width variance along the branch path
          const smoothWidth = 3.6 + Math.sin(i * 0.9) * 0.5;

          ctx.strokeStyle = "#1a1a1a";
          ctx.lineWidth = smoothWidth;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.quadraticCurveTo(cpX, cpY, p2.x, p2.y);
          ctx.stroke();

          // Tiny, subtle smooth node swelling at the curve midpoint
          if (i % 2 === 0) {
            const midT = 0.5;
            const mx = (1 - midT) * (1 - midT) * p1.x + 2 * (1 - midT) * midT * cpX + midT * midT * p2.x;
            const my = (1 - midT) * (1 - midT) * p1.y + 2 * (1 - midT) * midT * cpY + midT * midT * p2.y;

            ctx.fillStyle = "#1a1a1a";
            ctx.beginPath();
            ctx.arc(mx, my, 2, 0, Math.PI * 2);
            ctx.fill();

            // Tiny light core
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(mx, my, 0.7, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Secondary smooth connections
        if (i + 2 < points.length && i % 3 === 0) {
          const p3 = points[i + 2];
          if (!p3) continue;

          ctx.strokeStyle = "#2b2b2b";
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.stroke();
        }
      }

      // Main joint nodes (clean and polished)
      points.forEach((p, idx) => {
        const radius = idx === 0 ? 4.8 : 3.6;

        ctx.fillStyle = "#1a1a1a";
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius - 1.5, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (branchStyle === "thin") {
      // --- ULTRA THIN ---
      drawConnections("#222222", 0.8, "square");
      points.forEach((p) => {
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (branchStyle === "steel") {
      // --- STEEL FRAME ---
      drawConnections("#333333", 4.5, "butt");
      drawConnections("#999999", 1.5, "butt");
      points.forEach((p) => {
        const s = 7;
        ctx.fillStyle = "#111111";
        ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.strokeRect(p.x - s / 2 + 1, p.y - s / 2 + 1, s - 2, s - 2);
      });
    }
  }, [text, branchStyle]);

  return (
    <div className="flex items-center justify-center w-full h-full p-4">
      <canvas
        ref={canvasRef}
        className="w-[240px] h-[240px] border border-white/20 bg-white shadow-2xl block"
      />
    </div>
  );
}