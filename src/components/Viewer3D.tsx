import React, { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from "three";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import { Button } from "./ui/button";

interface Viewer3DProps {
  text: string;
  autoRotate?: boolean;
}

function createExtrudedMatrix(text: string) {
  const group = new Group();
  group.name = `Risukko ${text}`;
  group.userData.risukkoIdentifier = text;
  group.rotation.set(0.4, 0.4, 0);
  const gridSize = 5;
  const spacing = 0.6;

  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      const charCode = text.charCodeAt((x + y) % (text.length || 1)) || 65;
      const height = ((charCode % (x + 2)) * 0.2) + 0.2;
      const mesh = new Mesh(
        new BoxGeometry(1, 1, 1),
        new MeshStandardMaterial({
          color: "#ffffff",
          roughness: 0.1,
          metalness: 0.8,
          wireframe: false,
        }),
      );
      mesh.position.set(
        (x - gridSize / 2 + 0.5) * spacing,
        (y - gridSize / 2 + 0.5) * spacing,
        height / 2,
      );
      mesh.scale.set(0.45, 0.45, height);
      group.add(mesh);
    }
  }

  return group;
}

export function Viewer3D({ text, autoRotate = true }: Viewer3DProps) {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const matrix = useMemo(() => createExtrudedMatrix(text), [text]);

  useEffect(() => () => {
    matrix.traverse((object) => {
      if (!(object instanceof Mesh)) return;
      object.geometry.dispose();
      object.material.dispose();
    });
  }, [matrix]);

  async function exportModel() {
    setExporting(true);
    setError(null);
    try {
      const output = await new GLTFExporter().parseAsync(matrix, { binary: true });
      if (!(output instanceof ArrayBuffer)) {
        throw new Error("The exporter did not produce a binary GLB file.");
      }

      const url = URL.createObjectURL(new Blob([output], { type: "model/gltf-binary" }));
      const link = document.createElement("a");
      const safeName = text.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-|-$/g, "");
      link.href = url;
      link.download = `risukko-${safeName || "identity"}.glb`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not export the 3D identity.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="w-full max-w-[520px]">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">Generated from the current identifier.</p>
        <Button disabled={exporting} onClick={() => void exportModel()} variant="outline">
          {exporting ? "Exporting…" : "Download GLB"}
        </Button>
      </div>
      {error && <p className="mb-3 text-sm text-red-700" role="alert">{error}</p>}
      <div className="relative h-[300px] w-full overflow-hidden rounded-lg border border-border bg-slate-900">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={1.5} />
          <pointLight position={[10, 10, 10]} intensity={2} />
          <primitive object={matrix} />
          <OrbitControls enableZoom={false} autoRotate={autoRotate} autoRotateSpeed={1.5} />
        </Canvas>
      </div>
    </div>
  );
}
