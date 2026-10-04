"use client";

import { useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import RealReactor from "./RealReactor";
import Studio from "./Studio";
import useVisible from "./useVisible";

// Tilts toward the mouse and turns a little as the page scrolls.
function Rig({ children }: { children: React.ReactNode }) {
  const g = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  useFrame(() => {
    if (!g.current) return;
    const scroll = window.scrollY / window.innerHeight;
    g.current.rotation.y = THREE.MathUtils.lerp(g.current.rotation.y, pointer.x * 0.45 + Math.min(scroll, 1.2) * 0.5, 0.06);
    g.current.rotation.x = THREE.MathUtils.lerp(g.current.rotation.x, -pointer.y * 0.3, 0.06);
  });
  return <group ref={g}>{children}</group>;
}

export default function Reactor3D() {
  const wrap = useRef<HTMLDivElement>(null);
  const visible = useVisible(wrap);
  const [dpr, setDpr] = useState(1.5);
  const [bloom, setBloom] = useState(true);
  return (
    <div ref={wrap} className="h-full w-full [mask-image:radial-gradient(circle_at_center,black_58%,transparent_72%)]">
      <Canvas frameloop={visible ? "always" : "never"} dpr={dpr} camera={{ position: [0, 0, 8.2], fov: 38 }} gl={{ antialias: true, powerPreference: "high-performance" }}>
        <PerformanceMonitor onDecline={() => { setDpr(1); setBloom(false); }} onIncline={() => setDpr(1.5)} />
        <color attach="background" args={["#050404"]} />
        <Studio />
        <Rig><RealReactor variant="classic" /></Rig>
        {bloom && (
          <EffectComposer multisampling={0}>
            <Bloom mipmapBlur intensity={0.8} luminanceThreshold={1} luminanceSmoothing={0.15} radius={0.6} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
