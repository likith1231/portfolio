"use client";

import { useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import SuitModel from "./SuitModel";
import Studio from "./Studio";
import useVisible from "./useVisible";
import type { Suit } from "@/data/portfolio";

const RADIUS = 5.2;

function Pod({ suit, angle, active }: { suit: Suit; angle: number; active: boolean }) {
  const spin = useRef<THREE.Group>(null);
  const ring = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((_, dt) => {
    if (spin.current) spin.current.rotation.y = active ? spin.current.rotation.y + dt * 0.45 : THREE.MathUtils.lerp(spin.current.rotation.y, 0, 0.05);
    if (ring.current) ring.current.emissiveIntensity = THREE.MathUtils.lerp(ring.current.emissiveIntensity, active ? 2.2 : 0.25, 0.08);
  });
  return (
    <group position={[Math.sin(angle) * RADIUS, 0, Math.cos(angle) * RADIUS]} rotation={[0, angle, 0]}>
      {/* plinth */}
      <mesh position={[0, -1.75, 0]}>
        <cylinderGeometry args={[1.25, 1.4, 0.35, 6]} />
        <meshStandardMaterial color="#1a1515" metalness={0.8} roughness={0.4} />
      </mesh>
      <mesh position={[0, -1.56, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.0, 1.12, 6]} />
        <meshStandardMaterial ref={ring} color="#ffb84d" emissive="#ffb84d" emissiveIntensity={0.25} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      {/* glass case edges */}
      {active && (
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[1.3, 1.3, 4.4, 6, 1, true]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.04} metalness={1} roughness={0} side={THREE.DoubleSide} />
        </mesh>
      )}
      <group ref={spin} scale={0.62} position={[0, -0.55, 0]}>
        <SuitModel armor={suit.armor} active={active} mark={suit.mark} />
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
    // shortest way round
    let cur = g.current.rotation.y;
    const diff = Math.atan2(Math.sin(target - cur), Math.cos(target - cur));
    cur += diff * 0.07;
    g.current.rotation.y = cur;
    g.current.rotation.x = THREE.MathUtils.lerp(g.current.rotation.x, pointer.y * 0.04, 0.05);
  });
  return (
    <group ref={g} position={[0, 0, -RADIUS]}>
      {suits.map((s, i) => <Pod key={s.slug} suit={s} angle={i * step} active={i === index} />)}
    </group>
  );
}

export default function Hall3D({ suits, index }: { suits: Suit[]; index: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  const visible = useVisible(wrap);
  return (
    <div ref={wrap} className="h-full w-full">
      <Canvas frameloop={visible ? "always" : "never"} dpr={[1, 1.6]} camera={{ position: [0, 0.6, 3.6], fov: 42 }} gl={{ antialias: true, alpha: true }}>
        <fog attach="fog" args={["#050404", 5, 14]} />
        <Studio />
        <spotLight position={[0, 6, 2]} angle={0.45} penumbra={0.8} intensity={60} color="#ffe2b8" />
        <mesh position={[0, -1.95, -RADIUS]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[9, 64]} />
          <meshStandardMaterial color="#0d0a0a" metalness={0.6} roughness={0.55} />
        </mesh>
        <Carousel suits={suits} index={index} />
        <EffectComposer>
          <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.9} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
