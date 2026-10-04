"use client";

import { Environment, Lightformer } from "@react-three/drei";

// Studio lighting for the metal, built from light panels so no HDR file is downloaded.
export default function Studio({ warm = true }: { warm?: boolean }) {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 5, 4]} intensity={1.6} color={warm ? "#ffe2b8" : "#e6ecf5"} />
      <directionalLight position={[-4, 2, -3]} intensity={0.9} color="#ff3b3b" />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={3} position={[0, 4, -6]} scale={[10, 2, 1]} color={warm ? "#ffd9a0" : "#ffffff"} />
        <Lightformer form="rect" intensity={1.1} position={[-6, 1, 1]} rotation-y={Math.PI / 2} scale={[6, 1.5, 1]} color="#ff4040" />
        <Lightformer form="rect" intensity={1.6} position={[6, 1, 1]} rotation-y={-Math.PI / 2} scale={[6, 1.5, 1]} color="#ffffff" />
        <Lightformer form="ring" intensity={1.5} position={[0, 2, 6]} scale={3} color="#ffe7c2" />
      </Environment>
    </>
  );
}
