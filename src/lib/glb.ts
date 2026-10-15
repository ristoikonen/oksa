import { GLTFLoader, type GLTF } from "three/addons/loaders/GLTFLoader.js";

export const maxGlbFileSize = 50 * 1024 * 1024;

export function validateGlbFile(file: File) {
  if (!file.name.toLowerCase().endsWith(".glb")) {
    throw new Error("Choose a .glb file. Separate-file .gltf models are not supported yet.");
  }
  if (file.size > maxGlbFileSize) {
    throw new Error("This file is larger than the 50 MB limit.");
  }
}

export async function parseGlbFile(file: File): Promise<GLTF> {
  validateGlbFile(file);
  const data = await file.arrayBuffer();
  return new GLTFLoader().parseAsync(data, "");
}

export function getRisukkoIdentifier(gltf: GLTF): string | null {
  for (const scene of gltf.scenes) {
    let identifier: string | null = null;
    scene.traverse((object) => {
      if (identifier) return;
      const metadata = object.userData.risukkoIdentifier;
      if (typeof metadata === "string") {
        identifier = metadata;
        return;
      }
      const nameMatch = /^Risukko\s+(.+)$/i.exec(object.name);
      if (nameMatch?.[1]) identifier = nameMatch[1];
    });
    if (identifier) return identifier;
  }
  return null;
}
