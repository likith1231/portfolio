"use client";

import { Suspense, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import SuitGLB from "./SuitGLB";
import Studio from "./Studio";
import useVisible from "./useVisible";
import type { Suit } from "@/data/portfolio";

const RADIUS = 5.2;
const PLINTH_TOP = -1.575;

function Pod({ suit, angle, active }: { suit: Suit; angle: number; active: boolean }) {
  const spin = useRef<THREE.Group>(null);
  const ring = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((_, dt) => {
    if (spin.current) spin.current.rotation.y = active ? spin.current.rotation.y + dt * 0.35 : THREE.MathUtils.lerp(spin.current.rotation.y, 0, 0.05);
    if (ring.current) ring.current.emissiveIntensity = THREE.MathUtils.lerp(ring.current.emissiveIntensity, active ? 2.2 : 0.25, 0.08);
  });
  return (
    <group position={[Math.sin(angle) * RADIUS, 0, Math.cos(angle) * RADIUS]} rotation={[0, angle, 0]}>
      <mesh position={[0, -1.75, 0]}>
        <cylinderGeometry args={[1.25, 1.4, 0.35, 6]} />
        <meshStandardMaterial color="#1a1515" metalness={0.8} roughness={0.4} />
      </mesh>
      <mesh position={[0, -1.56, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.0, 1.12, 6]} />
        <meshStandardMaterial ref={ring} color="#ffb84d" emissive="#ffb84d" emissiveIntensity={0.25} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <group ref={spin} position={[0, PLINTH_TOP, 0]}>
        <Suspense fallback={null}>
          <SuitGLB url={suit.model} active={active} height={suit.model.includes("hulkbuster") ? 3.0 : 2.55} />
        </Suspense>
      </group>
    </group>
  );
}

function Carousel({ suits, index }: { suits: Suit[]; index: number }) {
  const g = useRef<THREE.Group>(null);
  const step = (Math.PI * 2) / suits.length;
  useFrame(({ pointer }) => {
    if (!g.current) return;
    const target = -index * step;
    let cur = g.current.rotation.y;
    cur += Math.atan2(Math.sin(target - cur), Math.cos(target - cur)) * 0.07;
    g.current.rotation.y = cur;
    g.current.rotation.x = THREE.MathUtils.lerp(g.current.rotation.x, pointer.y * 0.03, 0.05);
  });
  return (
    <group ref={g} position={[0, 0, -RADIUS]}>
      {suits.map((s, i) => <Pod key={s.slug} suit={s} angle={i * step} active={i === index} />)}
    </group>
  );
}

export default function Hall3D({ suits, index }: { suits: Suit[]; index: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  const visible = useVisible(wrap, "300px");
  const [dpr, setDpr] = useState(1.5);
  const [bloom, setBloom] = useState(true);
  return (
    <div ref={wrap} className="h-full w-full">
      {visible || wrap.current ? (
        <Canvas frameloop={visible ? "always" : "never"} dpr={dpr} camera={{ position: [0, 0.9, 5.6], fov: 38 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
          <PerformanceMonitor onDecline={() => { setDpr(1); setBloom(false); }} />
          <fog attach="fog" args={["#050404", 6, 15]} />
          <Studio />
          <spotLight position={[0, 6, 3]} angle={0.42} penumbra={0.8} intensity={70} color="#ffe2b8" />
          <mesh position={[0, -1.95, -RADIUS]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[9, 64]} />
            <meshStandardMaterial color="#0d0a0a" metalness={0.6} roughness={0.55} />
          </mesh>
          <Carousel suits={suits} index={index} />
          {bloom && (
            <EffectComposer multisampling={0}>
              <Bloom mipmapBlur intensity={0.7} luminanceThreshold={1} radius={0.6} />
            </EffectComposer>
          )}
        </Canvas>
      ) : null}
    </div>
  );
}
