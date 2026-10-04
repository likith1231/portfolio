"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { Armor } from "@/data/portfolio";

const REACTOR = new THREE.Color("#8fefff");

function extrude(points: [number, number][], depth: number, bevel = 0.05, holes: THREE.Path[] = []) {
  const s = new THREE.Shape(points.map(([x, y]) => new THREE.Vector2(x, y)));
  holes.forEach((h) => s.holes.push(h));
  const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel * 0.8, bevelSegments: 3, curveSegments: 24 });
  g.center();
  return g;
}

const mirror = (pts: [number, number][]) => pts.map(([x, y]) => [-x, y] as [number, number]).reverse();

// A procedural armor bust: helmet, chest plate, gold trim, abs and a glowing arc reactor.
export default function SuitModel({ armor, active = true, mark = 6 }: { armor: Armor; active?: boolean; mark?: number }) {
  const core = useRef<THREE.Mesh>(null);
  const eyes = useRef<THREE.MeshStandardMaterial>(null);

  const geo = useMemo(() => {
    const hole = new THREE.Path();
    hole.absarc(0, 0.32, 0.27, 0, Math.PI * 2, true);
    const chest = extrude([[-1.15, 0.85], [-0.45, 1.05], [0.45, 1.05], [1.15, 0.85], [1.05, 0.1], [0.7, -0.55], [0.35, -0.8], [-0.35, -0.8], [-0.7, -0.55], [-1.05, 0.1]], 0.28, 0.08, [hole]);
    const pecL: [number, number][] = [[-1.0, 0.78], [-0.42, 0.93], [-0.34, 0.58], [-0.55, 0.12], [-0.97, 0.24]];
    const pec = extrude(pecL, 0.08, 0.03);
    const pecR = extrude(mirror(pecL), 0.08, 0.03);
    const abs = [0, 1, 2].map((i) => extrude([[-0.42 + i * 0.05, 0], [0.42 - i * 0.05, 0], [0.38 - i * 0.05, -0.2], [-0.38 + i * 0.05, -0.2]], 0.16, 0.03));
    const face = extrude([[-0.36, 0.3], [0.36, 0.3], [0.4, -0.05], [0.24, -0.42], [0, -0.5], [-0.24, -0.42], [-0.4, -0.05]], 0.08, 0.03);
    const eye = extrude([[-0.13, 0.03], [0.02, 0.0], [0.0, -0.04], [-0.12, -0.03]], 0.02, 0.005);
    return { chest, pec, pecR, abs, face, eye };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (core.current) (core.current.material as THREE.MeshStandardMaterial).emissiveIntensity = armor.glow * (active ? 1 + Math.sin(t * 3) * 0.15 : 0.35);
    if (eyes.current) eyes.current.emissiveIntensity = active ? 2.4 + Math.sin(t * 5) * 0.3 : 0.4;
  });

  const metal = { metalness: armor.metal, roughness: armor.rough, flatShading: mark === 1 };
  const primary = <meshStandardMaterial color={armor.primary} {...metal} />;
  const secondary = <meshStandardMaterial color={armor.secondary} metalness={Math.min(1, armor.metal + 0.05)} roughness={armor.rough * 0.8} flatShading={mark === 1} />;
  const dark = <meshStandardMaterial color="#141112" metalness={0.6} roughness={0.5} />;

  return (
    <group>
      {/* helmet */}
      <group position={[0, 1.95, 0.05]}>
        <mesh scale={[0.55, 0.66, 0.6]} castShadow>
          <sphereGeometry args={[1, 48, 48]} />
          {primary}
        </mesh>
        <mesh geometry={geo.face} position={[0, -0.05, 0.56]} rotation={[-0.08, 0, 0]}>{secondary}</mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} geometry={geo.eye} position={[s * 0.15, 0.06, 0.62]} scale={[s, 1, 1]}>
            <meshStandardMaterial ref={s === 1 ? eyes : undefined} color="#ffffff" emissive="#ffffff" emissiveIntensity={2.4} toneMapped={false} />
          </mesh>
        ))}
        <mesh position={[0, -0.62, -0.05]}>
          <cylinderGeometry args={[0.28, 0.34, 0.3, 24]} />
          {dark}
        </mesh>
      </group>

      {/* torso */}
      <mesh geometry={geo.chest} position={[0, 0.55, 0]} castShadow>{primary}</mesh>
      <mesh geometry={geo.pec} position={[-0.67, 1.08, 0.2]}>{secondary}</mesh>
      <mesh geometry={geo.pecR} position={[0.67, 1.08, 0.2]}>{secondary}</mesh>
      {geo.abs.map((g, i) => (
        <mesh key={i} geometry={g} position={[0, -0.42 - i * 0.26, 0.05]}>{i % 2 ? primary : secondary}</mesh>
      ))}

      {/* shoulders */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 1.32, 1.28, -0.05]} rotation={[0, 0, s * -0.5]} scale={[0.5, 0.42, 0.55]}>
          <sphereGeometry args={[1, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
          {primary}
        </mesh>
      ))}

      {/* arc reactor */}
      <group position={[0, 0.87, 0.2]}>
        <mesh>
          <torusGeometry args={[0.27, 0.05, 16, 48]} />
          {secondary}
        </mesh>
        {Array.from({ length: 10 }).map((_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.17, Math.sin(a) * 0.17, 0.02]} rotation={[0, 0, a]}>
              <boxGeometry args={[0.05, 0.035, 0.03]} />
              <meshStandardMaterial color={REACTOR} emissive={REACTOR} emissiveIntensity={active ? 1.2 : 0.2} toneMapped={false} />
            </mesh>
          );
        })}
        <mesh ref={core} position={[0, 0, 0.03]}>
          <circleGeometry args={[0.1, 32]} />
          <meshStandardMaterial color="#ffffff" emissive={REACTOR} emissiveIntensity={armor.glow} toneMapped={false} />
        </mesh>
        {active && <pointLight color={REACTOR} intensity={2.5} distance={3} position={[0, 0, 0.4]} />}
      </group>
    </group>
  );
}
