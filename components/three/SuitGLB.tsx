"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { clone as cloneSkinned } from "three/examples/jsm/utils/SkeletonUtils.js";

// One of the suits from /public/models, scaled to `height` and standing on y = 0.
// Same finish and glow treatment for all of them.
export default function SuitGLB({ url, height = 2.6, active = true }: { url: string; height?: number; active?: boolean }) {
  const { scene } = useGLTF(url, false, true);

  // Rigged suits need a skeleton-aware clone, or they ignore where they are placed.
  const { model, scale, offset } = useMemo(() => {
    const m = cloneSkinned(scene);
    m.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(m);
    const size = box.getSize(new THREE.Vector3());
    const k = height / Math.max(size.y, 1e-6);
    const center = box.getCenter(new THREE.Vector3());
    return { model: m, scale: k, offset: new THREE.Vector3(-center.x * k, -box.min.y * k, -center.z * k) };
  }, [scene, height]);

  useEffect(() => {
    model.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if ((mesh as THREE.SkinnedMesh).isSkinnedMesh) mesh.frustumCulled = false;
      const m = mesh.material as THREE.MeshStandardMaterial | undefined;
      if (!m || !("envMapIntensity" in m)) return;
      m.envMapIntensity = 1.1;
      if (m.emissiveMap) {
        m.emissive = new THREE.Color("#ffffff");
        m.emissiveIntensity = active ? 2.6 : 0.4;
        m.toneMapped = !active;
      }
      m.needsUpdate = true;
    });
  }, [model, active]);

  return (
    <group position={offset} scale={scale}>
      <primitive object={model} />
    </group>
  );
}
