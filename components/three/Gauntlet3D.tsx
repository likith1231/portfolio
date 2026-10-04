"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Studio from "./Studio";
import useVisible from "./useVisible";
import type { SnapPhase } from "../Gauntlet";

const URL = "/models/gauntlet.glb";

function Model({ lit, phase }: { lit: number; phase: SnapPhase }) {
  const { scene } = useGLTF(URL, false, true);
  const model = useMemo(() => scene.clone(true), [scene]);
  const g = useRef<THREE.Group>(null);
  const stones = useRef<THREE.MeshStandardMaterial[]>([]);
  const state = useRef({ lit, phase });
  state.current = { lit, phase };

  useEffect(() => {
    stones.current = [];
    model.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
      if (!m) return;
      m.envMapIntensity = 1.2;
      if (m.emissiveMap) { m.emissive = new THREE.Color("#ffffff"); m.toneMapped = false; stones.current.push(m); }
    });
  }, [model]);

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();
    const { lit, phase } = state.current;
    const busy = phase !== "idle";
    // stones breathe at rest, and blaze brighter with every stone lit during the snap
    const glow = busy ? 1.2 + lit * 0.9 : 1.1 + Math.sin(t * 1.6) * 0.35;
    stones.current.forEach((m) => (m.emissiveIntensity = glow));
    if (!g.current) return;
    const shake = phase === "snap" ? (Math.random() - 0.5) * 0.12 : 0;
    g.current.rotation.y = THREE.MathUtils.lerp(g.current.rotation.y, (busy ? 0 : Math.sin(t * 0.4) * 0.35) + pointer.x * 0.4, 0.05) + shake;
    g.current.rotation.x = THREE.MathUtils.lerp(g.current.rotation.x, -pointer.y * 0.2, 0.05);
    g.current.position.y = busy ? 0 : Math.sin(t * 1.1) * 0.06;
    g.current.position.x = shake;
  });

  return <group ref={g}><primitive object={model} /></group>;
}

// The Iron Man nano-gauntlet in 3D, for the Snap section.
export default function Gauntlet3D({ lit, phase }: { lit: number; phase: SnapPhase }) {
  const wrap = useRef<HTMLDivElement>(null);
  const visible = useVisible(wrap);
  return (
    <div ref={wrap} className="h-full w-full">
      <Canvas frameloop={visible ? "always" : "never"} dpr={[1, 1.5]} camera={{ position: [0, 0.1, 4.6], fov: 40 }} gl={{ alpha: true }}>
        <Studio />
        <spotLight position={[2, 4, 4]} angle={0.5} penumbra={0.8} intensity={40} color="#ffe2b8" />
        <Suspense fallback={null}><Model lit={lit} phase={phase} /></Suspense>
        <EffectComposer multisampling={0}><Bloom mipmapBlur intensity={0.9} luminanceThreshold={1} radius={0.6} /></EffectComposer>
      </Canvas>
    </div>
  );
}

useGLTF.preload(URL, false, true);
