"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

const GLOW = new THREE.Color("#9ff3ff");

// The arc reactor model, with its core lit and a gentle hum in the light.
export default function ArcReactorGLB() {
  const { scene } = useGLTF("/models/arc-reactor.glb", false, true);
  const model = useMemo(() => scene.clone(true), [scene]);
  const leds = useRef<THREE.MeshStandardMaterial[]>([]);
  const core = useRef<THREE.MeshBasicMaterial>(null);
  const light = useRef<THREE.PointLight>(null);

  useEffect(() => {
    leds.current = [];
    model.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
      if (!m) return;
      m.envMapIntensity = 1.2;
      if (m.name === "reactor_glow") {
        m.emissive = GLOW.clone();
        m.emissiveIntensity = 3;
        m.toneMapped = false;
        leds.current.push(m);
      }
    });
  }, [model]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const hum = 1 + Math.sin(t * 2.1) * 0.06 + Math.sin(t * 13.7) * 0.02;
    leds.current.forEach((m) => (m.emissiveIntensity = 3 * hum));
    if (core.current) core.current.opacity = 0.55 * hum;
    if (light.current) light.current.intensity = 6 * hum;
  });

  return (
    <group>
      <primitive object={model} />
      {/* light spilling out of the core */}
      <mesh position={[0, 0, 0.35]}>
        <circleGeometry args={[0.62, 48]} />
        <meshBasicMaterial ref={core} color={GLOW} transparent opacity={0.55} toneMapped={false} />
      </mesh>
      <pointLight ref={light} color={GLOW} intensity={6} distance={6} decay={2} position={[0, 0, 1.4]} />
    </group>
  );
}

useGLTF.preload("/models/arc-reactor.glb", false, true);
