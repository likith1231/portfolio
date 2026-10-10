import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[100svh] items-center justify-center px-4">
      <div className="grid-bg pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      <div className="relative text-center">
        <div className="hud-label text-danger">● signal lost · suit off course</div>
        <h1 className="mt-4 font-display text-8xl font-bold text-white md:text-9xl">4<span className="gold-text">0</span>4</h1>
        <p className="mt-4 font-serif text-2xl italic text-steel-300">This page flew off the radar.</p>
        <Link href="/" className="btn-hot mt-8">Return to the workshop →</Link>
      </div>
    </main>
  );
}
