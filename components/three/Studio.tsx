"use client";

import { Environment, Lightformer } from "@react-three/drei";

// Neutral studio lighting for realistic metal, built from light panels (no HDR download).
export default function Studio() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} color="#fff3e2" />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={4} position={[0, 5, 2]} scale={[8, 1.2, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={2} position={[-6, 1, 3]} rotation-y={Math.PI / 2.5} scale={[5, 2, 1]} color="#ffe2c4" />
        <Lightformer form="rect" intensity={1.2} position={[6, -1, 3]} rotation-y={-Math.PI / 2.5} scale={[5, 2, 1]} color="#c9e8ff" />
        <Lightformer form="ring" intensity={2} position={[0, 0, 8]} scale={4} color="#ffffff" />
      </Environment>
    </>
  );
}
