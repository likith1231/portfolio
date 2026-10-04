"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Studio from "./Studio";
import useVisible from "./useVisible";

const CYAN = new THREE.Color("#8fefff");
const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

function Part({ children, from, delay, t0 }: { children: React.ReactNode; from: [number, number, number]; delay: number; t0: React.MutableRefObject<number | null> }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    if (t0.current === null) t0.current = clock.getElapsedTime();
    const k = ease((clock.getElapsedTime() - t0.current - delay) / 1.1);
    ref.current.position.set(from[0] * (1 - k), from[1] * (1 - k), from[2] * (1 - k));
    ref.current.rotation.z = (1 - k) * 2;
    ref.current.scale.setScalar(0.4 + 0.6 * k);
  });
  return <group ref={ref}>{children}</group>;
}

function Sparks({ count = 220 }) {
  const ref = useRef<THREE.Points>(null);
  const [pos, speed] = useMemo(() => {
    const p = new Float32Array(count * 3);
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 14;
      p[i * 3 + 1] = (Math.random() - 0.5) * 10;
      p[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
      s[i] = 0.2 + Math.random() * 0.8;
    }
    return [p, s];
  }, [count]);
  useFrame((_, dt) => {
    const a = ref.current?.geometry.attributes.position as THREE.BufferAttribute | undefined;
    if (!a) return;
    for (let i = 0; i < count; i++) {
      let y = a.getY(i) + speed[i] * dt * 0.6;
      if (y > 5) y = -5;
      a.setY(i, y);
    }
    a.needsUpdate = true;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#ffb84d" transparent opacity={0.8} toneMapped={false} />
    </points>
  );
}

function Reactor() {
  const root = useRef<THREE.Group>(null);
  const ringA = useRef<THREE.Group>(null);
  const ringB = useRef<THREE.Group>(null);
  const coils = useRef<THREE.Group>(null);
  const core = useRef<THREE.MeshStandardMaterial>(null);
  const t0 = useRef<number | null>(null);
  const { pointer } = useThree();

  useFrame(({ clock }, dt) => {
    const t = clock.getElapsedTime();
    const scroll = typeof window !== "undefined" ? window.scrollY / window.innerHeight : 0;
    if (root.current) {
      root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, pointer.x * 0.5 + scroll * 0.8, 0.06);
      root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, -pointer.y * 0.35, 0.06);
    }
    if (ringA.current) ringA.current.rotation.z += dt * 0.25;
    if (ringB.current) ringB.current.rotation.z -= dt * 0.6;
    if (coils.current) coils.current.rotation.z += dt * 0.12;
    if (core.current) core.current.emissiveIntensity = 4 + Math.sin(t * 2.4) * 0.8 + Math.min(3, scroll * 2);
  });

  const gold = <meshStandardMaterial color="#e2a845" metalness={1} roughness={0.22} />;
  const red = <meshStandardMaterial color="#b3121d" metalness={0.85} roughness={0.3} />;
  const steel = <meshStandardMaterial color="#6f6f74" metalness={1} roughness={0.35} />;

  return (
    <group ref={root}>
      <Part from={[0, 0, -6]} delay={0} t0={t0}>
        <mesh><torusGeometry args={[2.25, 0.14, 24, 120]} />{gold}</mesh>
        <mesh position={[0, 0, -0.15]}><cylinderGeometry args={[2.3, 2.3, 0.2, 96, 1, true]} />{steel}</mesh>
      </Part>
      <Part from={[4, 3, 2]} delay={0.15} t0={t0}>
        <group ref={ringA}>
          {Array.from({ length: 12 }).map((_, i) => (
            <mesh key={i} rotation={[0, 0, (i / 12) * Math.PI * 2]}>
              <torusGeometry args={[1.95, 0.09, 12, 24, (Math.PI * 2) / 12 - 0.08]} />
              {red}
            </mesh>
          ))}
        </group>
      </Part>
      <Part from={[-4, -3, 3]} delay={0.3} t0={t0}>
        <group ref={coils}>
          {Array.from({ length: 10 }).map((_, i) => {
            const a = (i / 10) * Math.PI * 2;
            return (
              <group key={i} position={[Math.cos(a) * 1.35, Math.sin(a) * 1.35, 0.05]} rotation={[0, 0, a + Math.PI / 2]}>
                <mesh><boxGeometry args={[0.32, 0.5, 0.18]} />{steel}</mesh>
                {[-0.15, 0, 0.15].map((y) => (
                  <mesh key={y} position={[0, y, 0.1]}>
                    <boxGeometry args={[0.28, 0.05, 0.04]} />
                    <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={2.2} toneMapped={false} />
                  </mesh>
                ))}
              </group>
            );
          })}
        </group>
      </Part>
      <Part from={[0, 5, 1]} delay={0.45} t0={t0}>
        <group ref={ringB}>
          <mesh><torusGeometry args={[0.9, 0.05, 12, 64]} />{gold}</mesh>
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i / 24) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * 0.78, Math.sin(a) * 0.78, 0.05]}>
                <boxGeometry args={[0.05, 0.05, 0.05]} />
                <meshStandardMaterial color="#ffe0a3" emissive="#ffb84d" emissiveIntensity={1.5} toneMapped={false} />
              </mesh>
            );
          })}
        </group>
      </Part>
      <Part from={[0, -5, 2]} delay={0.6} t0={t0}>
        <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.62, 0.62, 0.12, 6]} />{steel}</mesh>
        <mesh position={[0, 0, 0.1]}>
          <circleGeometry args={[0.5, 48]} />
          <meshStandardMaterial ref={core} color="#ffffff" emissive={CYAN} emissiveIntensity={4} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0, 0.12]}>
          <circleGeometry args={[0.22, 32]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
        <pointLight color={CYAN} intensity={8} distance={8} position={[0, 0, 1]} />
      </Part>
    </group>
  );
}

export default function Reactor3D() {
  const wrap = useRef<HTMLDivElement>(null);
  const visible = useVisible(wrap);
  return (
    <div ref={wrap} className="h-full w-full">
      <Canvas frameloop={visible ? "always" : "never"} dpr={[1, 1.75]} camera={{ position: [0, 0, 7.2], fov: 40 }} gl={{ antialias: true, alpha: true }}>
        <Studio />
        <Reactor />
        <Sparks />
        <EffectComposer>
          <Bloom mipmapBlur intensity={1.1} luminanceThreshold={0.85} luminanceSmoothing={0.2} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
