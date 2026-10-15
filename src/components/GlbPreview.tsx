import { Bounds, Center, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import type { Group } from "three";
import { parseGlbFile, validateGlbFile } from "../lib/glb";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

export function GlbPreview() {
  const [file, setFile] = useState<File | null>(null);
  const [model, setModel] = useState<Group | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) {
      setModel(null);
      setLoading(false);
      return;
    }

    const selectedFile = file;
    let active = true;
    setLoading(true);
    setError(null);
    setModel(null);

    async function loadModel() {
      try {
        const gltf = await parseGlbFile(selectedFile);
        if (!active) return;
        setModel(gltf.scene);
        setLoading(false);
      } catch (cause) {
        if (!active) return;
        setError(cause instanceof Error ? cause.message : "Could not read this GLB model.");
        setLoading(false);
      }
    }

    void loadModel();
    return () => {
      active = false;
    };
  }, [file]);

  function selectFile(selected: File | undefined) {
    if (!selected) return;
    try {
      validateGlbFile(selected);
    } catch (cause) {
      setFile(null);
      setLoading(false);
      setError(cause instanceof Error ? cause.message : "This GLB file is not supported.");
      return;
    }

    setError(null);
    setFile(selected);
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold">Local 3D model preview</h3>
          <p className="mt-1 text-xs text-muted-foreground">Choose a .glb file up to 50 MB.</p>
        </div>
        <Button onClick={() => inputRef.current?.click()} variant="outline">
          {file ? "Choose another" : "Choose .glb"}
        </Button>
        <input
          ref={inputRef}
          id="glb-upload"
          type="file"
          accept=".glb,model/gltf-binary"
          className="sr-only"
          onChange={(event) => {
            selectFile(event.currentTarget.files?.[0]);
            event.currentTarget.value = "";
          }}
        />
      </div>
      <CardContent className="p-4 sm:p-6">
        {file && <p className="mb-3 truncate text-sm text-muted-foreground" title={file.name}>{file.name}</p>}
        {error && (
          <p className="mb-3 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}
        <div className="relative h-[min(65vh,560px)] min-h-80 overflow-hidden rounded-lg border border-border bg-slate-50">
          {model ? (
            <Canvas
              aria-label="Interactive 3D model preview"
              camera={{ position: [0, 0, 4], fov: 45 }}
              role="img"
            >
              <color attach="background" args={["#f8fafc"]} />
              <ambientLight intensity={1.5} />
              <directionalLight position={[4, 6, 5]} intensity={2} />
              <Bounds fit clip observe margin={1.25}>
                <Center>
                  <primitive object={model} />
                </Center>
              </Bounds>
              <OrbitControls makeDefault />
            </Canvas>
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
              {loading ? "Loading model…" : "Select a .glb file to preview it here."}
            </div>
          )}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          The selected file is read locally in your browser; it is not uploaded or saved.
        </p>
      </CardContent>
    </Card>
  );
}
