"use client";

import dynamic from "next/dynamic";
import { suits } from "@/data/portfolio";

const SuitViewer = dynamic(() => import("./three/SuitViewer"), { ssr: false, loading: () => <div className="grid h-full place-items-center hud-label">assembling suit…</div> });

export default function SuitStage({ slug }: { slug: string }) {
  const suit = suits.find((s) => s.slug === slug);
  if (!suit) return null;
  return <SuitViewer suit={suit} />;
}
