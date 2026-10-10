"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import useVisible from "./useVisible";

// An original iron mask for the Doom universe: hammered iron in a dark emerald hood,
// glowing green eyes, and rings of mystic runes turning around it. Everything is built
// in code (no model download), so it costs nothing on the network.

const GREEN = new THREE.Color("#3cff9a");

// Small deterministic PRNG so the runes and the hammered texture are the same on every visit.
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const gauss = (x: number) => Math.exp(-x * x);

// The mask's shape, as an offset along the surface for a point on the face.
const EYE = { x: 0.29, y: 0.16, w: 0.17, h: 0.052, tilt: 0.2 };
function relief(x: number, y: number) {
  let d = 0;
  // brow ridge, broken in the middle
  d += 0.085 * gauss((y - 0.3) / 0.065) * smooth(0.66, 0.5, Math.abs(x)) * (0.55 + 0.45 * smooth(0.02, 0.12, Math.abs(x)));
  // eye sockets, slanted so the inner corners sit low
  for (const s of [-1, 1]) {
    const a = s * EYE.tilt;
    const dx = x - s * EYE.x, dy = y - EYE.y;
    const ex = dx * Math.cos(a) + dy * Math.sin(a);
    const ey = -dx * Math.sin(a) + dy * Math.cos(a);
    const e = (ex / EYE.w) ** 2 + (ey / EYE.h) ** 2;
    d -= 0.16 * smooth(1.35, 0.4, e);
  }
  // nose ridge
  d += 0.075 * gauss(x / 0.05) * smooth(-0.26, -0.18, y) * smooth(0.14, 0.04, y);
  // cheek plates
  for (const s of [-1, 1]) d += 0.05 * gauss((x - s * 0.36) / 0.13) * gauss((y + 0.12) / 0.13);
  // the mouth grille: a recessed plate crossed by vertical bars
  const plate = smooth(0.26, 0.21, Math.abs(x)) * smooth(-0.54, -0.5, y) * smooth(-0.32, -0.36, y);
  const bars = Math.pow(0.5 + 0.5 * Math.cos((2 * Math.PI * x) / 0.07), 3);
  d -= plate * (0.07 - 0.05 * bars);
  d -= 0.012 * gauss(x / 0.008) * smooth(-0.46, -0.52, y);
  // a seam where the faceplate meets the brow band
  d -= 0.01 * gauss((y - 0.43) / 0.01) * smooth(0.6, 0.4, Math.abs(x));
  return d;
}

// Unit-sphere direction → point on the mask.
function shape(u: THREE.Vector3, out: THREE.Vector3) {
  // a flattened ellipsoid: a broad front plate that turns back sharply at the sides
  const pw = (v: number, k: number) => Math.sign(v) * Math.pow(Math.abs(v), k);
  let x = pw(u.x, 0.85) * 0.8;
  const y = u.y * 1.1, z = pw(u.z, 0.5) * 0.66;
  if (y < -0.25) x *= 1 - 0.2 * smooth(-0.25, -1.05, y); // jaw tapers to a square chin
  const d = relief(x, y) * smooth(0.2, 0.6, u.z);
  return out.set(x, y, z + d);
}

const PHI0 = Math.PI / 2 - 1.42, PHIL = 2.84, TH0 = 0.36, THL = 2.42;

function useIronTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 512;
    const g = c.getContext("2d")!;
    const r = rng(7);
    g.fillStyle = "#8a8a8a";
    g.fillRect(0, 0, 512, 512);
    // hammer dents and pitting
    for (let i = 0; i < 2200; i++) {
      const v = Math.floor(90 + r() * 110);
      g.fillStyle = `rgba(${v},${v},${v},${0.08 + r() * 0.2})`;
      g.beginPath();
      g.arc(r() * 512, r() * 512, 1 + r() * (i < 300 ? 14 : 3), 0, Math.PI * 2);
      g.fill();
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(3, 2);
    return t;
  }, []);
}

// One ring of runes drawn on a canvas: original glyphs made of straight cuts, like carved staves.
function useRuneTexture(seed: number, count: number) {
  return useMemo(() => {
    const S = 1024, c = document.createElement("canvas");
    c.width = c.height = S;
    const g = c.getContext("2d")!;
    const r = rng(seed);
    g.translate(S / 2, S / 2);
    g.strokeStyle = "#ffffff";
    g.shadowColor = "#3cff9a";
    g.shadowBlur = 14;
    g.lineCap = "round";
    for (const [rad, w] of [[498, 3], [478, 1.5], [372, 1.5], [352, 3]] as const) {
      g.lineWidth = w;
      g.beginPath();
      g.arc(0, 0, rad, 0, Math.PI * 2);
      g.stroke();
    }
    g.lineWidth = 4.5;
    for (let i = 0; i < count; i++) {
      g.save();
      g.rotate((i / count) * Math.PI * 2);
      g.translate(0, -415);
      const h = 58, w = 26;
      g.beginPath();
      g.moveTo(0, -h / 2);
      g.lineTo(0, h / 2);
      const strokes = 1 + Math.floor(r() * 3);
      for (let k = 0; k < strokes; k++) {
        const y0 = -h / 2 + r() * h * 0.7;
        const side = r() > 0.5 ? 1 : -1;
        g.moveTo(0, y0);
        g.lineTo(side * w * (0.6 + r() * 0.4), y0 + (r() - 0.3) * h * 0.5);
        if (r() > 0.6) g.lineTo(0, y0 + h * 0.35);
      }
      g.stroke();
      g.restore();
    }
    return new THREE.CanvasTexture(c);
  }, [seed, count]);
}

function RuneRing({ seed, count, size, speed, tilt = 0, z = 0, opacity = 1 }: { seed: number; count: number; size: number; speed: number; tilt?: number; z?: number; opacity?: number }) {
  const tex = useRuneTexture(seed, count);
  const m = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => { if (m.current) m.current.rotation.z += dt * speed; });
  return (
    <group rotation={[tilt, 0, 0]} position={[0, 0, z]}>
      <mesh ref={m}>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial map={tex} color={GREEN.clone().multiplyScalar(1.6)} transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Mask() {
  const iron = useIronTexture();
  // Both eyes share one material, so one pulse drives them.
  const eyes = useMemo(() => new THREE.MeshBasicMaterial({ color: GREEN.clone().multiplyScalar(3.2), toneMapped: false }), []);
  const eyeLight = useRef<THREE.PointLight>(null);

  const face = useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 180, 160, PHI0, PHIL, TH0, THL);
    const p = geo.attributes.position as THREE.BufferAttribute;
    const u = new THREE.Vector3(), o = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      u.fromBufferAttribute(p, i).normalize();
      shape(u, o);
      p.setXYZ(i, o.x, o.y, o.z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Rivets in aged gold along both edges of the faceplate and across the brow band.
  const rivets = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const u = new THREE.Vector3(), o = new THREE.Vector3();
    const at = (phi: number, th: number, lift = 0.012) => {
      u.set(-Math.cos(phi) * Math.sin(th), Math.cos(th), Math.sin(phi) * Math.sin(th));
      shape(u, o);
      pts.push(o.clone().addScaledVector(u, lift));
    };
    for (let k = 0; k < 9; k++) {
      const th = TH0 + 0.2 + (k / 8) * (THL - 0.5);
      at(PHI0 + 0.07, th);
      at(PHI0 + PHIL - 0.07, th);
    }
    for (let k = 0; k < 11; k++) at(Math.PI / 2 - 0.9 + (k / 10) * 1.8, TH0 + 0.1);
    return pts;
  }, []);

  const hood = useMemo(() => {
    const geo = new THREE.SphereGeometry(1.2, 120, 80, Math.PI / 2 + 1.0, Math.PI * 2 - 2.0, 0, 2.45);
    const p = geo.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      // cloth folds that hang down the sides
      const a = Math.atan2(v.z, v.x);
      const fold = 0.035 * Math.sin(a * 9 + v.y * 1.5) * smooth(0.9, -0.6, v.y);
      v.multiplyScalar(1 + fold);
      v.set(v.x * 0.98, v.y * 1.12, v.z * 0.92);
      p.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Each eye: an almond of light sitting in its socket.
  const eyeGeo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-1, 0);
    s.quadraticCurveTo(0, 0.95, 1, 0);
    s.quadraticCurveTo(0, -0.75, -1, 0);
    return new THREE.ShapeGeometry(s, 24);
  }, []);
  const eyeZ = useMemo(() => {
    const u = new THREE.Vector3(EYE.x / 0.8, EYE.y / 1.1, 0);
    u.z = Math.sqrt(Math.max(0, 1 - u.x * u.x - u.y * u.y));
    return shape(u.normalize(), new THREE.Vector3()).z + 0.006;
  }, []);

  useEffect(() => () => { face.dispose(); hood.dispose(); eyeGeo.dispose(); eyes.dispose(); }, [face, hood, eyeGeo, eyes]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    // a slow pulse with the odd flicker, like a fire behind the iron
    const k = 3.2 + Math.sin(t * 1.7) * 0.5 + (Math.sin(t * 23) > 0.97 ? -1.2 : 0);
    eyes.color.copy(GREEN).multiplyScalar(k);
    if (eyeLight.current) eyeLight.current.intensity = 0.5 + Math.sin(t * 1.7) * 0.15;
  });

  return (
    <group>
      <mesh geometry={face}>
        <meshStandardMaterial color="#9a9fa6" metalness={0.8} roughness={0.6} roughnessMap={iron} bumpMap={iron} bumpScale={1.4} envMapIntensity={1.2} />
      </mesh>
      {rivets.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.022, 12, 8]} />
          <meshStandardMaterial color="#b08d3c" metalness={1} roughness={0.32} />
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <mesh key={s} geometry={eyeGeo} material={eyes} position={[s * EYE.x, EYE.y, eyeZ]} rotation={[0, s * 0.32, s * EYE.tilt]} scale={[EYE.w * 0.9, EYE.h * 1.15, 1]}/>
      ))}
      <pointLight ref={eyeLight} position={[0, EYE.y, eyeZ + 0.25]} color="#3cff9a" intensity={0.5} distance={0.8} decay={2} />
      <mesh geometry={hood} position={[0, 0.06, -0.08]}>
        <meshStandardMaterial color="#1f6b47" roughness={0.85} metalness={0} side={THREE.DoubleSide} envMapIntensity={0.7} />
      </mesh>
    </group>
  );
}

function Rig({ children }: { children: React.ReactNode }) {
  const g = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  useFrame(({ clock }) => {
    if (!g.current) return;
    const scroll = window.scrollY / window.innerHeight;
    g.current.rotation.y = THREE.MathUtils.lerp(g.current.rotation.y, pointer.x * 0.4 + Math.min(scroll, 1.2) * 0.4, 0.05);
    g.current.rotation.x = THREE.MathUtils.lerp(g.current.rotation.x, -pointer.y * 0.25, 0.05);
    g.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.04;
  });
  return <group ref={g}>{children}</group>;
}

// Cold throne-room light: a pale key from above, green bounce from the sorcery below.
function Throne() {
  return (
    <>
      <ambientLight intensity={0.12} />
      <directionalLight position={[3, 5, 5]} intensity={1.5} color="#eef4ff" />
      <pointLight position={[0, -2.2, 1.5]} intensity={3} distance={6} color="#3cff9a" />
      <pointLight position={[0, 1.8, -2.2]} intensity={18} distance={6} color="#3cff9a" />
      <pointLight position={[2.5, 0.5, 3]} intensity={4} distance={8} color="#ffffff" />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={4} position={[0, 5, 2]} scale={[8, 1.2, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={1.6} position={[-6, 1, 3]} rotation-y={Math.PI / 2.5} scale={[5, 2, 1]} color="#d6e4ff" />
        <Lightformer form="rect" intensity={1.6} position={[6, -1, 3]} rotation-y={-Math.PI / 2.5} scale={[5, 2, 1]} color="#7dffc0" />
        <Lightformer form="ring" intensity={1.5} position={[0, 0, 8]} scale={4} color="#ffffff" />
        {/* a broad soft panel in front, so the iron reads as metal rather than a black mirror */}
        <Lightformer form="rect" intensity={0.9} position={[0, -1, 6]} scale={[12, 6, 1]} color="#cfd8d3" />
        <Lightformer form="rect" intensity={0.8} position={[0, -5, 1]} rotation-x={Math.PI / 2} scale={[8, 3, 1]} color="#3cff9a" />
      </Environment>
    </>
  );
}

export default function DoomMask3D() {
  const wrap = useRef<HTMLDivElement>(null);
  const visible = useVisible(wrap);
  const [dpr, setDpr] = useState(1.5);
  const [bloom, setBloom] = useState(true);
  return (
    <div ref={wrap} className="h-full w-full [mask-image:radial-gradient(circle_at_center,black_60%,transparent_74%)]">
      <Canvas frameloop={visible ? "always" : "never"} dpr={dpr} camera={{ position: [0, 0, 7.4], fov: 38 }} gl={{ antialias: true, powerPreference: "high-performance" }}>
        <PerformanceMonitor onDecline={() => { setDpr(1); setBloom(false); }} onIncline={() => setDpr(1.5)} />
        <color attach="background" args={["#030605"]} />
        <Throne />
        <RuneRing seed={11} count={30} size={5.0} speed={0.08} z={-1.2} opacity={0.75} />
        <RuneRing seed={29} count={22} size={3.4} speed={-0.14} z={-1.0} opacity={0.5} />
        <Rig>
          <group scale={1.12}>
            <Mask />
          </group>
          <group position={[0, -1.25, 0]}><RuneRing seed={5} count={18} size={3.6} speed={0.22} tilt={1.4} opacity={0.45} /></group>
        </Rig>
        <Sparkles count={50} scale={[5, 4, 2]} size={2.5} speed={0.35} color="#3cff9a" opacity={0.8} />
        {bloom && (
          <EffectComposer multisampling={0}>
            <Bloom mipmapBlur intensity={0.9} luminanceThreshold={1} luminanceSmoothing={0.15} radius={0.65} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
