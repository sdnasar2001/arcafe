"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { journey, useIsMobile, useReducedMotion } from "@/lib/journey";
import Monogram from "./Monogram";

// The 3D scene is loaded as its own chunk, after the page itself is on screen.
const Scene = dynamic(() => import("./three/Scene"), { ssr: false });

/**
 * The fixed 3D layer behind the first four sections, and the scroll director that
 * turns the page's scroll position into the scene's journey (hero → story → signature → anatomy).
 * After the anatomy section the layer fades out and stops rendering, to save battery.
 */
export default function Experience() {
  const mobile = useIsMobile();
  const reduced = useReducedMotion();
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [active, setActive] = useState(true);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ok = false;
    try {
      const c = document.createElement("canvas");
      ok = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time capability check
    setWebgl(ok);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ids = ["story", "signature", "anatomy"];
    const prog = [0, 0, 0];
    const triggers = ids.map((id, i) => {
      const update = (s: ScrollTrigger) => {
        prog[i] = s.progress;
        journey.stage = prog[0] + prog[1] + prog[2];
      };
      return ScrollTrigger.create({
        trigger: "#" + id,
        start: "top bottom",
        end: i === 2 ? "top top" : "top 25%",
        onUpdate: update,
        onRefresh: update,
      });
    });
    const fadeUpdate = (s: ScrollTrigger) => {
      const f = 1 - s.progress;
      journey.fade = f;
      if (wrap.current) wrap.current.style.opacity = String(f);
      setActive(f > 0.002);
    };
    const fade = ScrollTrigger.create({
      trigger: "#anatomy",
      start: "bottom 95%",
      end: "bottom 15%",
      onUpdate: fadeUpdate,
      onRefresh: fadeUpdate,
    });

    const onMove = (e: PointerEvent) => {
      journey.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      journey.pointerY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    // Images and fonts arriving change section heights; keep the triggers accurate.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => {
      triggers.forEach((t) => t.kill());
      fade.kill();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("load", refresh);
    };
  }, []);

  return (
    <div ref={wrap} aria-hidden className="pointer-events-none fixed inset-0 z-0 bg-ink" style={{ visibility: active ? "visible" : "hidden" }}>
      {webgl && <Scene mobile={mobile} reduced={reduced} active={active} />}
      {webgl === false && (
        // No 3D available: a quiet glowing monogram stands in for the scene.
        <div className="absolute inset-0 grid place-items-center">
          <div className="absolute h-[70vmin] w-[70vmin] rounded-full bg-[radial-gradient(circle,rgba(214,180,119,.18),transparent_65%)]" />
          <Monogram className="relative mt-[28vh] w-[28vmin] opacity-30" />
        </div>
      )}
      {/* classical gold lattice, strongest at the edges so the cup stays clean */}
      <div className="bg-classic absolute inset-0 [mask-image:radial-gradient(ellipse_48%_42%_at_50%_62%,transparent_40%,#000_95%)]" />
      {/* vignette keeps type readable over the scene */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(16,26,43,.55)_100%)]" />
    </div>
  );
}
