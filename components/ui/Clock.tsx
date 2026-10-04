"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/portfolio";

export default function Clock({ seconds = true }: { seconds?: boolean }) {
  const [t, setT] = useState("--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: seconds ? "2-digit" : undefined, timeZone: profile.timezone, hour12: false });
    const tick = () => setT(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [seconds]);
  return <span suppressHydrationWarning>{t}</span>;
}
