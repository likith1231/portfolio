"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useHUD } from "./Shell";
import { SECTIONS, useGo } from "./Nav";
import { armory, otherBuilds, profile, projects, socials } from "@/data/portfolio";

type Out = { kind: "in" | "out" | "err" | "ok"; text: string };

const COMMANDS: [string, string][] = [
  ["help", "list commands"],
  ["whoami", "who built this"],
  ["ls", "list projects"],
  ["open <project>", "read a project's schematic"],
  ["goto <section>", SECTIONS.map((s) => s.id).join(" | ")],
  ["status", "deploy status of every project"],
  ["stack", "the armory"],
  ["email", "copy my email address"],
  ["github | linkedin", "open a profile"],
  ["suit", "toggle stealth / mark colours"],
  ["recruiter", "the 30-second brief"],
  ["clear", "clear the screen"],
];

const GREETING: Out[] = [
  { kind: "ok", text: `${profile.callsign} HUD terminal. Type “help”, or try “open ghostops”.` },
];

export default function CommandPalette() {
  const { paletteOpen, setPaletteOpen, toggleMode, setBriefOpen, unibeam } = useHUD();
  const router = useRouter();
  const go = useGo();
  const [lines, setLines] = useState<Out[]>(GREETING);
  const [value, setValue] = useState("");
  const [hist, setHist] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const input = useRef<HTMLInputElement>(null);
  const body = useRef<HTMLDivElement>(null);

  useEffect(() => { if (paletteOpen) setTimeout(() => input.current?.focus(), 50); }, [paletteOpen]);
  useEffect(() => { body.current?.scrollTo({ top: body.current.scrollHeight }); }, [lines]);

  const findProject = (q: string) => projects.find((p) => p.slug.includes(q) || p.name.toLowerCase().replace(/\s/g, "").includes(q.replace(/[\s-]/g, "")));

  const exec = (raw: string) => {
    const cmd = raw.trim();
    const [c, ...rest] = cmd.toLowerCase().split(/\s+/);
    const arg = rest.join(" ");
    const out: Out[] = [{ kind: "in", text: cmd }];
    const say = (text: string, kind: Out["kind"] = "out") => out.push({ kind, text });
    const close = (fn: () => void) => { setTimeout(() => { setPaletteOpen(false); fn(); }, 250); };

    switch (c) {
      case "":
        break;
      case "help":
        COMMANDS.forEach(([k, d]) => say(`${k.padEnd(20)} ${d}`));
        break;
      case "whoami":
        say(`${profile.name} · ${profile.role}`);
        say(`${profile.focus} · ${profile.location}`);
        say(profile.education);
        break;
      case "ls":
      case "projects":
        projects.forEach((p) => say(`${p.mark}  ${p.name.padEnd(18)} ${p.live ? "live" : "deploying"}`));
        otherBuilds.forEach((b) => say(`  +      ${b.name.padEnd(18)} ${b.live ? "live" : "source"}`));
        break;
      case "open":
      case "cd":
      case "cat": {
        const p = arg && findProject(arg);
        if (p) { say(`opening ${p.name} schematic…`, "ok"); close(() => router.push(`/work/${p.slug}`)); }
        else say(`no such suit: ${arg || "(empty)"}. try: ${projects.map((x) => x.slug).join(", ")}`, "err");
        break;
      }
      case "goto": {
        const s = SECTIONS.find((x) => x.id.startsWith(arg));
        if (s) { say(`navigating to ${s.id}…`, "ok"); close(() => go(s.id)); }
        else say(`unknown section. try: ${SECTIONS.map((x) => x.id).join(", ")}`, "err");
        break;
      }
      case "status":
      case "kubectl":
        projects.forEach((p) => say(`${p.name.padEnd(20)} ${p.live ? "● Running   " + p.live.replace("https://", "") : "◌ Pending   awaiting first cloud deploy"}`, p.live ? "ok" : "out"));
        otherBuilds.forEach((b) => say(`${b.name.padEnd(20)} ${b.live ? "● Running   " + b.live.replace("https://", "") : "○ Source    " + b.repo.replace("https://", "")}`, b.live ? "ok" : "out"));
        break;
      case "stack":
        armory.forEach((g) => say(`${g.group.padEnd(15)} ${g.items.join(", ")}`));
        break;
      case "email":
      case "contact":
        navigator.clipboard?.writeText(profile.email).catch(() => {});
        say(`${profile.email} (copied to clipboard)`, "ok");
        break;
      case "github":
        say("opening GitHub…", "ok"); window.open(socials.github, "_blank");
        break;
      case "linkedin":
        say("opening LinkedIn…", "ok"); window.open(socials.linkedin, "_blank");
        break;
      case "resume":
        if (profile.resume) { say("opening résumé…", "ok"); window.open(profile.resume, "_blank"); }
        else say("résumé uploading soon. Email me for a copy in the meantime.", "err");
        break;
      case "suit":
      case "theme":
        toggleMode(); say("armour colours toggled.", "ok");
        break;
      case "recruiter":
      case "brief":
        say("loading the 30-second brief…", "ok"); close(() => setBriefOpen(true));
        break;
      case "unibeam":
      case "reactor":
        say("discharging reactor…", "ok"); close(unibeam);
        break;
      case "sudo":
        if (arg.includes("hire")) { say("permission granted. drafting an email…", "ok"); close(() => { window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent("Let's talk about a role")}`; }); }
        else say("nice try. this incident has been reported.", "err");
        break;
      case "rm":
        say("rm: refusing to remove production. GhostOps would open a PR to undo it anyway.", "err");
        break;
      case "clear":
        setLines([]); return;
      case "exit":
        setPaletteOpen(false); break;
      default:
        say(`command not found: ${c}. type “help”.`, "err");
    }
    setLines((l) => [...l, ...out]);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { exec(value); if (value.trim()) setHist((h) => [value, ...h]); setValue(""); setHi(-1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); const n = Math.min(hi + 1, hist.length - 1); if (hist[n]) { setHi(n); setValue(hist[n]); } }
    else if (e.key === "ArrowDown") { e.preventDefault(); const n = hi - 1; setHi(n); setValue(n >= 0 ? hist[n] : ""); }
    else if (e.key === "Tab") {
      e.preventDefault();
      const names = ["help", "whoami", "ls", "status", "stack", "email", "github", "linkedin", "suit", "recruiter", "clear", ...projects.map((p) => `open ${p.slug}`), ...SECTIONS.map((s) => `goto ${s.id}`)];
      const m = names.find((n) => n.startsWith(value.toLowerCase()) && n !== value);
      if (m) setValue(m);
    }
  };

  return (
    <AnimatePresence>
      {paletteOpen && (
        <motion.div className="fixed inset-0 z-[80] flex items-start justify-center bg-black/70 px-4 pt-[12vh] backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setPaletteOpen(false)}>
          <motion.div onMouseDown={(e) => e.stopPropagation()} initial={{ y: 20, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 10, scale: 0.98 }}
            className="hud-panel hud-corners w-full max-w-2xl border-arc/30 bg-void-900/95 shadow-[0_0_60px_rgb(var(--arc)/0.15)]" role="dialog" aria-label="Terminal">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-2.5 font-mono text-[11px] text-steel-400">
              <span>~/likith — zsh</span>
              <button onClick={() => setPaletteOpen(false)} className="hover:text-white">esc ✕</button>
            </div>
            <div ref={body} className="h-[min(360px,50vh)] overflow-y-auto px-4 py-3 font-mono text-[12.5px] leading-relaxed" onClick={() => input.current?.focus()}>
              {lines.map((l, i) => (
                <div key={i} className={`whitespace-pre-wrap ${l.kind === "in" ? "text-white" : l.kind === "err" ? "text-danger" : l.kind === "ok" ? "text-arc" : "text-steel-300"}`}>
                  {l.kind === "in" && <span className="text-ok">➜ </span>}{l.text}
                </div>
              ))}
              <div className="flex items-center">
                <span className="text-ok">➜&nbsp;</span>
                <input ref={input} value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={onKey} spellCheck={false} autoComplete="off"
                  className="flex-1 bg-transparent text-white caret-arc outline-none" aria-label="Command" />
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 border-t border-white/[0.07] px-4 py-2.5">
              {["whoami", "ls", "status", "open ghostops", "sudo hire likith"].map((s) => (
                <button key={s} onClick={() => exec(s)} className="chip hover:border-arc/50 hover:text-arc">{s}</button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
