import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[100svh] items-center justify-center px-4">
      <div className="grid-bg pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      <div className="relative text-center">
        <div className="hud-label text-danger">● signal lost</div>
        <h1 className="mt-4 font-display text-8xl font-bold text-white md:text-9xl">404</h1>
        <p className="mt-4 font-mono text-sm text-steel-400">This route isn't in the flight plan. No incident filed; GhostOps is already on it.</p>
        <Link href="/" className="btn-primary mt-8">Return to base →</Link>
      </div>
    </main>
  );
}
