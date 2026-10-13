import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

interface Viewer3DProps {
  text: string;
  autoRotate?: boolean;
}

function ExtrudedMatrix({ text }: { text: string }) {
  const boxes = useMemo(() => {
    const items = [];
    const gridSize = 5;
    const spacing = 0.6;

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const charCode = text.charCodeAt((x + y) % (text.length || 1)) || 65;
        const height = ((charCode % (x + 1 + 1)) * 0.2) + 0.2;
        items.push({
          position: [
            (x - gridSize / 2 + 0.5) * spacing,
            (y - gridSize / 2 + 0.5) * spacing,
            height / 2,
          ] as [number, number, number],
          scale: [0.45, 0.45, height] as [number, number, number],
        });
      }
    }
    return items;
  }, [text]);

  return (
    <group rotation={[0.4, 0.4, 0]}>
      {boxes.map((box, idx) => (
        <mesh key={idx} position={box.position} scale={box.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.1}
            metalness={0.8}
            wireframe={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export function Viewer3D({ text, autoRotate = true }: Viewer3DProps) {
  return (
    <div className="w-[240px] h-[240px] border border-white/20 bg-black relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <ExtrudedMatrix text={text} />
        <OrbitControls enableZoom={false} autoRotate={autoRotate} autoRotateSpeed={1.5} />
      </Canvas>
    </div>
  );
}