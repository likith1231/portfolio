"use client";

import { Suspense, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import SuitGLB from "./SuitGLB";
import Studio from "./Studio";
import useVisible from "./useVisible";
import type { Suit } from "@/data/portfolio";

function Spin({ suit }: { suit: Suit }) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ pointer }, dt) => {
    if (!g.current) return;
    g.current.rotation.y += dt * 0.3;
    g.current.rotation.x = THREE.MathUtils.lerp(g.current.rotation.x, -pointer.y * 0.15, 0.05);
  });
  return (
    <group ref={g} position={[0, -1.55, 0]}>
      <Suspense fallback={null}><SuitGLB url={suit.model} height={3} /></Suspense>
    </group>
  );
}

// A single suit on a turntable, for the schematic pages.
export default function SuitViewer({ suit }: { suit: Suit }) {
  const wrap = useRef<HTMLDivElement>(null);
  const visible = useVisible(wrap);
  return (
    <div ref={wrap} className="h-full w-full [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_75%)]">
      <Canvas frameloop={visible ? "always" : "never"} dpr={[1, 1.5]} camera={{ position: [0, 0.3, 5.4], fov: 38 }} gl={{ alpha: true }}>
        <color attach="background" args={["#050404"]} />
        <Studio />
        <spotLight position={[2, 5, 4]} angle={0.5} penumbra={0.8} intensity={50} color="#ffe2b8" />
        <Spin suit={suit} />
        <EffectComposer multisampling={0}><Bloom mipmapBlur intensity={0.7} luminanceThreshold={1} /></EffectComposer>
      </Canvas>
    </div>
  );
}
