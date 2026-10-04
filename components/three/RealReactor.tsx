"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const GLOW = new THREE.Color("#9ff3ff");

// Turned-metal profile of the outer housing (radius, depth), revolved into a ring.
const HOUSING: [number, number][] = [
  [1.98, -0.32], [2.5, -0.32], [2.58, -0.24], [2.58, 0.06], [2.5, 0.16], [2.42, 0.16], [2.38, 0.1], [2.26, 0.1], [2.22, 0.2], [2.12, 0.2], [2.08, 0.06], [1.98, 0.02],
];
const INNER: [number, number][] = [
  [0.72, -0.2], [1.02, -0.2], [1.08, -0.12], [1.08, 0.12], [1.0, 0.2], [0.86, 0.2], [0.8, 0.1], [0.72, 0.08],
];

function lathe(profile: [number, number][], segments = 128) {
  const g = new THREE.LatheGeometry(profile.map(([r, z]) => new THREE.Vector2(r, z)), segments);
  g.rotateX(Math.PI / 2); // face the camera
  return g;
}

// Copper wire wound around one coil block, as a helix tube.
function windingCurve(turns: number, len: number, w: number, d: number) {
  const pts: THREE.Vector3[] = [];
  const steps = turns * 24;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = t * turns * Math.PI * 2;
    // a rounded-rectangle wrap: stretch a circle into the block's cross-section
    const c = Math.cos(a), s = Math.sin(a);
    const sx = Math.sign(c) * Math.pow(Math.abs(c), 0.55);
    const sz = Math.sign(s) * Math.pow(Math.abs(s), 0.55);
    pts.push(new THREE.Vector3(sx * w, -len / 2 + t * len, sz * d));
  }
  return new THREE.CatmullRomCurve3(pts);
}

export type ReactorVariant = "classic" | "triangle";

// A realistic arc reactor built from machined parts. "classic" is the round, coil-wound
// design; "triangle" is the later triangular core.
export default function RealReactor({ variant = "classic", assemble = true }: { variant?: ReactorVariant; assemble?: boolean }) {
  const core = useRef<THREE.MeshStandardMaterial>(null);
  const backGlow = useRef<THREE.MeshBasicMaterial>(null);
  const light = useRef<THREE.PointLight>(null);
  const parts = useRef<(THREE.Group | null)[]>([]);
  const t0 = useRef<number | null>(null);

  const geo = useMemo(() => {
    const housing = lathe(HOUSING);
    const inner = lathe(INNER);
    const winding = new THREE.TubeGeometry(windingCurve(16, 0.52, 0.2, 0.15), 16 * 24, 0.016, 6, false);
    const tri = new THREE.Shape();
    const R = 0.62;
    for (let i = 0; i < 3; i++) {
      const a = -Math.PI / 2 + (i * Math.PI * 2) / 3 + Math.PI;
      const x = Math.cos(a) * R, y = Math.sin(a) * R;
      i === 0 ? tri.moveTo(x, y) : tri.lineTo(x, y);
    }
    tri.closePath();
    const triangle = new THREE.ExtrudeGeometry(tri, { depth: 0.12, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.05, bevelSegments: 4 });
    triangle.center();
    return { housing, inner, winding, triangle };
  }, []);

  const steel = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#a9abb0", metalness: 1, roughness: 0.32, clearcoat: 0.4, clearcoatRoughness: 0.4 }), []);
  const darkSteel = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#3b3d42", metalness: 1, roughness: 0.45 }), []);
  const copper = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#c27a46", metalness: 1, roughness: 0.28, clearcoat: 0.6, clearcoatRoughness: 0.2 }), []);
  const polymer = useMemo(() => new THREE.MeshStandardMaterial({ color: "#16181b", metalness: 0.2, roughness: 0.6 }), []);
  const glass = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#ffffff", metalness: 0, roughness: 0.04, transparent: true, opacity: 0.12, clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 2 }), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // a faint, uneven hum in the light
    const hum = 1 + Math.sin(t * 2.1) * 0.05 + Math.sin(t * 13.7) * 0.015;
    if (core.current) core.current.emissiveIntensity = 1.6 * hum;
    if (backGlow.current) backGlow.current.opacity = 0.32 * hum;
    if (light.current) light.current.intensity = 3 * hum;

    if (!assemble) return;
    if (t0.current === null) t0.current = t;
    const e = t - t0.current;
    parts.current.forEach((g, i) => {
      if (!g) return;
      const k = Math.min(1, Math.max(0, (e - i * 0.18) / 0.9));
      const ease = 1 - Math.pow(1 - k, 4);
      g.position.z = (1 - ease) * (i % 2 ? -4 : 4);
      g.rotation.z = (1 - ease) * (i % 2 ? -0.6 : 0.6);
      g.visible = k > 0;
    });
  });

  const P = (i: number) => (el: THREE.Group | null) => { parts.current[i] = el; };

  return (
    <group>
      {/* back plate and the light that leaks between the coils */}
      <group ref={P(0)}>
        <mesh position={[0, 0, -0.34]} material={polymer}><circleGeometry args={[2.5, 96]} /></mesh>
        <mesh position={[0, 0, -0.3]}>
          <ringGeometry args={[0.95, 2.0, 96]} />
          <meshBasicMaterial ref={backGlow} color="#1f9fb4" transparent opacity={0.32} />
        </mesh>
      </group>

      {/* machined outer housing with bolts */}
      <group ref={P(1)}>
        <mesh geometry={geo.housing} material={steel} />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2 + Math.PI / 12;
          return (
            <group key={i} position={[Math.cos(a) * 2.32, Math.sin(a) * 2.32, 0.16]}>
              <mesh rotation={[Math.PI / 2, 0, 0]} material={darkSteel}><cylinderGeometry args={[0.055, 0.055, 0.05, 6]} /></mesh>
              <mesh position={[0, 0, 0.026]} material={steel}><circleGeometry args={[0.025, 12]} /></mesh>
            </group>
          );
        })}
      </group>

      {variant === "classic" ? (
        <>
          {/* ten coil blocks, each wound with copper wire */}
          <group ref={P(2)}>
            {Array.from({ length: 10 }).map((_, i) => {
              const a = (i / 10) * Math.PI * 2;
              return (
                <group key={i} position={[Math.cos(a) * 1.5, Math.sin(a) * 1.5, -0.05]} rotation={[0, 0, a - Math.PI / 2]}>
                  <mesh material={polymer}><boxGeometry args={[0.34, 0.56, 0.24]} /></mesh>
                  <mesh geometry={geo.winding} material={copper} />
                </group>
              );
            })}
          </group>
          {/* inner ring */}
          <group ref={P(3)}>
            <mesh geometry={geo.inner} material={steel} />
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i / 8) * Math.PI * 2;
              return <mesh key={i} position={[Math.cos(a) * 0.9, Math.sin(a) * 0.9, 0.21]} rotation={[Math.PI / 2, 0, 0]} material={darkSteel}><cylinderGeometry args={[0.035, 0.035, 0.03, 6]} /></mesh>;
            })}
          </group>
          {/* core */}
          <group ref={P(4)}>
            <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.7, 0.7, 0.24, 64]} />
              <meshStandardMaterial ref={core} color="#bff6ff" emissive={GLOW} emissiveIntensity={1.6} toneMapped={false} />
            </mesh>
            <mesh position={[0, 0, 0.13]}>
              <ringGeometry args={[0.3, 0.7, 64]} />
              <meshPhysicalMaterial color="#dff9ff" transparent opacity={0.35} roughness={0.6} transmission={0} />
            </mesh>
          </group>
        </>
      ) : (
        <>
          {/* radial fins around a triangular core */}
          <group ref={P(2)}>
            {Array.from({ length: 36 }).map((_, i) => {
              const a = (i / 36) * Math.PI * 2;
              return (
                <mesh key={i} position={[Math.cos(a) * 1.5, Math.sin(a) * 1.5, -0.02]} rotation={[0, 0, a]} material={i % 3 ? darkSteel : steel}>
                  <boxGeometry args={[0.95, 0.045, 0.22]} />
                </mesh>
              );
            })}
          </group>
          <group ref={P(3)}>
            <mesh geometry={geo.inner} material={steel} />
          </group>
          <group ref={P(4)}>
            <mesh geometry={geo.triangle}>
              <meshStandardMaterial ref={core} color="#bff6ff" emissive={GLOW} emissiveIntensity={1.6} toneMapped={false} />
            </mesh>
            <mesh position={[0, 0, -0.05]} material={polymer}><circleGeometry args={[0.74, 64]} /></mesh>
          </group>
        </>
      )}

      {/* glass cover catching reflections */}
      <group ref={P(5)}>
        <mesh position={[0, 0, 0.24]} material={glass}><circleGeometry args={[2.12, 96]} /></mesh>
      </group>

      <pointLight ref={light} color={GLOW} intensity={3} distance={5} decay={2} position={[0, 0, 0.8]} />
    </group>
  );
}
