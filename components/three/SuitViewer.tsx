"use client";

import { useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import SuitModel from "./SuitModel";
import Studio from "./Studio";
import useVisible from "./useVisible";
import type { Suit } from "@/data/portfolio";

function Spin({ suit }: { suit: Suit }) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ pointer }, dt) => {
    if (!g.current) return;
    g.current.rotation.y += dt * 0.3;
    g.current.rotation.x = THREE.MathUtils.lerp(g.current.rotation.x, -pointer.y * 0.25, 0.05);
  });
  return <group ref={g} position={[0, -0.6, 0]} scale={0.85}><SuitModel armor={suit.armor} mark={suit.mark} /></group>;
}

// A single suit on a turntable, for the schematic pages.
export default function SuitViewer({ suit }: { suit: Suit }) {
  const wrap = useRef<HTMLDivElement>(null);
  const visible = useVisible(wrap);
  return (
    <div ref={wrap} className="h-full w-full">
      <Canvas frameloop={visible ? "always" : "never"} dpr={[1, 1.75]} camera={{ position: [0, 0.4, 5.2], fov: 40 }} gl={{ alpha: true }}>
        <Studio />
        <Spin suit={suit} />
        <EffectComposer><Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.9} /></EffectComposer>
      </Canvas>
    </div>
  );
}
