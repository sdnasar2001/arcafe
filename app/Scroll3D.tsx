"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { AddToOrder } from "./Order";
import { DishButton, type Dish } from "./Dish";

// A scroll story: the AR Cafe logo in 3D (a golden coffee bean inside three orbit rings).
// The section is pinned while you scroll through four panels: the intro, then one panel
// per menu group. Each orbit ring stands for one group and lights up when its panel shows.
// Without JavaScript, or with reduced motion, the panels simply sit one under another.

export type Step = { title: string; note: string; items: Dish[]; href: string };

const RING_COLOURS = [0xc2410c, 0x0f766e, 0x9d174d]; // tea, tiffin, bakery (the logo's orbits)

export default function Scroll3D({ intro, steps, currency, orderable }: { intro: ReactNode; steps: Step[]; currency: string; orderable?: boolean }) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const sec = section.current;
    const box = stage.current;
    const cv = canvas.current;
    if (!sec || !box || !cv) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    sec.classList.add(reduced ? "scrolly--static" : "scrolly--on");
    const panels = Array.from(sec.querySelectorAll<HTMLElement>(".scrolly__panel"));
    const stepCount = panels.length;

    let progress = 0;
    // Each panel owns one slice of the scroll. Its text slides in from below during the
    // first fifth of the slice and slides out upwards during the last fifth, so the words
    // move with your finger instead of switching.
    const clamp = (v: number) => Math.min(1, Math.max(0, v));
    // The text scrolls normally; only the 3D stage stays in place. Where the reading line
    // (the middle of the free screen) sits between two panels sets how far the 3D story has moved.
    const updatePanels = () => {
      const vh = window.innerHeight;
      const phone = window.innerWidth < 960;
      const top = phone ? 72 + box.offsetHeight : 72;
      const line = top + (vh - top) * 0.5;
      const centres = panels.map((p) => {
        const r = p.getBoundingClientRect();
        return r.top + r.height / 2;
      });
      let f = 0;
      if (line >= centres[stepCount - 1]) f = stepCount - 1;
      else if (line > centres[0]) {
        for (let i = 0; i < stepCount - 1; i++) {
          if (line >= centres[i] && line < centres[i + 1]) {
            f = i + (line - centres[i]) / Math.max(1, centres[i + 1] - centres[i]);
            break;
          }
        }
      }
      progress = f / Math.max(1, stepCount - 1);
      panels.forEach((panel, i) => {
        const dist = (centres[i] - line) / (vh - top);
        const fade = clamp((Math.abs(dist) - 0.18) / 0.4);
        panel.style.opacity = (1 - fade * 0.65).toFixed(3);
        panel.style.setProperty("--enter", clamp(dist / 0.45).toFixed(3));
      });
      sec.dataset.active = String(Math.round(f));
    };
    let ticking = false;
    const readScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        updatePanels();
      });
    };
    if (!reduced) {
      readScroll();
      window.addEventListener("scroll", readScroll, { passive: true });
      window.addEventListener("resize", readScroll);
    }

    let disposed = false;
    let cleanup3d = () => {};

    (async () => {
      let THREE: typeof import("three");
      let RoomEnvironment: typeof import("three/examples/jsm/environments/RoomEnvironment.js").RoomEnvironment;
      try {
        THREE = await import("three");
        ({ RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js"));
      } catch {
        return;
      }
      if (disposed) return;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true, powerPreference: "low-power" });
      } catch {
        sec.classList.add("scrolly--no3d");
        return;
      }
      const phone = window.innerWidth < 960;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, phone ? 1.5 : 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTex;

      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
      camera.position.set(0, 0, 10);

      const warm = new THREE.DirectionalLight(0xffe7c2, 1.4);
      warm.position.set(3, 4, 5);
      scene.add(warm);

      const logo = new THREE.Group();
      scene.add(logo);

      // Golden coffee bean with its crease
      const beanGroup = new THREE.Group();
      beanGroup.rotation.z = -0.49;
      logo.add(beanGroup);
      const beanGeo = new THREE.SphereGeometry(1, 64, 48);
      beanGeo.scale(0.8, 1.12, 0.62);
      const beanMat = new THREE.MeshPhysicalMaterial({ color: 0xc9a24a, metalness: 1, roughness: 0.26, clearcoat: 0.6, clearcoatRoughness: 0.2 });
      beanGroup.add(new THREE.Mesh(beanGeo, beanMat));
      const crease = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 1.06, 0.18),
        new THREE.Vector3(-0.16, 0.55, 0.5),
        new THREE.Vector3(0.15, 0, 0.62),
        new THREE.Vector3(-0.12, -0.55, 0.5),
        new THREE.Vector3(0, -1.06, 0.18),
      ]);
      const creaseGeo = new THREE.TubeGeometry(crease, 80, 0.05, 10, false);
      const creaseMat = new THREE.MeshStandardMaterial({ color: 0x3b2314, roughness: 0.55 });
      beanGroup.add(new THREE.Mesh(creaseGeo, creaseMat));

      // Three orbit rings with an electron each
      const R = 2.5;
      const ringGeo = new THREE.TorusGeometry(R, 0.055, 16, 220);
      const dotGeo = new THREE.SphereGeometry(0.13, 24, 16);
      const rings = RING_COLOURS.map((c, i) => {
        const pivot = new THREE.Group();
        pivot.rotation.z = (i * Math.PI) / 3;
        logo.add(pivot);
        const mat = new THREE.MeshStandardMaterial({ color: c, metalness: 0.35, roughness: 0.35, emissive: c, emissiveIntensity: 0.15 });
        const ring = new THREE.Mesh(ringGeo, mat);
        ring.rotation.x = 1.2;
        pivot.add(ring);
        const dotMat = new THREE.MeshStandardMaterial({ color: 0xfaf3e3, metalness: 0.2, roughness: 0.3, emissive: 0xfff2d6, emissiveIntensity: 0.25 });
        const dot = new THREE.Mesh(dotGeo, dotMat);
        ring.add(dot);
        return { pivot, ring, mat, dot, dotMat, angle: i * 2.1, speed: 0.7 + i * 0.22 };
      });

      // Champagne dust
      const count = phone ? 110 : 240;
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const r = 3.2 + Math.random() * 3.8;
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(2 * Math.random() - 1);
        pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
        pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.7;
        pos[i * 3 + 2] = r * Math.cos(ph) * 0.6 - 1;
      }
      const dustGeo = new THREE.BufferGeometry();
      dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const dustMat = new THREE.PointsMaterial({ color: 0xd9b45a, size: 0.035, transparent: true, opacity: 0.7, depthWrite: false });
      const dust = new THREE.Points(dustGeo, dustMat);
      scene.add(dust);

      const resize = () => {
        const w = box.clientWidth;
        const h = box.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        // keep the whole logo in frame on narrow stages
        camera.position.z = camera.aspect < 1 ? 10.5 / Math.max(0.62, camera.aspect) : 11.5;
        camera.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(box);
      resize();

      let smooth = progress;
      let last = performance.now();
      let elapsed = 0;
      const draw = (now: number) => {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        elapsed += reduced ? 0 : dt;
        smooth += (progress - smooth) * (reduced ? 1 : 0.12);
        const s = smooth * (stepCount - 1); // 0 = intro, 1 = tea, 2 = tiffin, 3 = bakery
        const kick = Math.min(1, s * 2); // eases in over the first half step so the first scroll is felt

        logo.rotation.y = elapsed * 0.12 + smooth * Math.PI * 1.4;
        logo.rotation.x = Math.sin(elapsed * 0.35) * 0.07 + Math.sin(smooth * Math.PI) * 0.25 + kick * 0.18;
        logo.position.y = -kick * 0.25;
        beanGroup.rotation.y = smooth * Math.PI * 2;
        const baseZ = camera.aspect < 1 ? 10.5 / Math.max(0.62, camera.aspect) : 11.5;
        camera.position.z = baseZ - Math.sin(smooth * Math.PI) * 0.9;

        rings.forEach((r, i) => {
          const h = Math.max(0, 1 - Math.abs(s - (i + 1)));
          r.mat.emissiveIntensity = 0.15 + h * 0.85;
          r.ring.scale.setScalar(1 + h * 0.07);
          r.ring.rotation.x = 1.2 - h * 0.35;
          r.angle += dt * r.speed;
          r.dot.position.set(Math.cos(r.angle) * R, Math.sin(r.angle) * R, 0);
          r.dotMat.emissiveIntensity = 0.25 + h * 0.6;
        });
        dust.rotation.y = elapsed * 0.02 + smooth * 0.6;
        renderer.render(scene, camera);
      };

      let raf = 0;
      let visible = true;
      const loop = (now: number) => {
        draw(now);
        raf = visible && !document.hidden ? requestAnimationFrame(loop) : 0;
      };
      const start = () => {
        if (!raf && !reduced) {
          last = performance.now();
          raf = requestAnimationFrame(loop);
        }
      };
      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible) start();
      });
      io.observe(sec);
      const onVis = () => {
        if (!document.hidden) start();
      };
      document.addEventListener("visibilitychange", onVis);
      if (reduced) draw(performance.now());
      else start();
      sec.classList.add("scrolly--ready");

      cleanup3d = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        [beanGeo, creaseGeo, ringGeo, dotGeo, dustGeo].forEach((g) => g.dispose());
        [beanMat, creaseMat, dustMat, ...rings.flatMap((r) => [r.mat, r.dotMat])].forEach((m) => m.dispose());
        envTex.dispose();
        pmrem.dispose();
        renderer.dispose();
      };
    })();

    return () => {
      disposed = true;
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", readScroll);
      cleanup3d();
    };
  }, []);

  return (
    <section ref={section} id="top" className="scrolly" data-active="0" aria-label="Welcome to the cafe">
      <div className="container scrolly__pin">
        <div className="scrolly__text">
          <div className="scrolly__panel hero" data-step="0">
            {intro}
          </div>
          {steps.map((st, i) => (
            <div key={st.title} className="scrolly__panel" data-step={i + 1}>
              <h2>{st.title}</h2>
              <p className="lead scrolly__note">{st.note}</p>
              <ul className="scrolly__items">
                {st.items.map((it, n) => (
                  <li key={it.name} style={{ "--i": n } as CSSProperties}>
                    {it.image ? (
                      <DishButton dish={it} className="dish-btn--photo">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img className="scrolly__thumb" src={it.image} alt="" width={56} height={56} loading="lazy" />
                      </DishButton>
                    ) : (
                      <span className="scrolly__thumb scrolly__thumb--none" aria-hidden="true" />
                    )}
                    <DishButton dish={it} className="scrolly__name">
                      {it.name}
                    </DishButton>
                    {it.price && (
                      <span className="scrolly__price">
                        {currency} {it.price}
                      </span>
                    )}
                    {orderable && <AddToOrder name={it.name} price={it.price} small />}
                  </li>
                ))}
              </ul>
              <a href={st.href} className="btn btn--line">
                {orderable ? "Order more " + st.title.toLowerCase() : "See " + st.title.toLowerCase()}
              </a>
            </div>
          ))}
        </div>
        <div ref={stage} className="scrolly__stage">
          <canvas ref={canvas} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
