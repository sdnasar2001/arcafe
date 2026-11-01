"use client";
/* eslint-disable react-hooks/immutability -- three.js objects (camera, scene, meshes) are mutated every frame by design */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { journey, smooth } from "@/lib/journey";

/*
 * The AR Cafe 3D scene: a porcelain cup and saucer with champagne-gold detailing,
 * rising steam, drifting gold dust and floating tea ingredients. Everything is
 * modelled in code (no downloads), so it loads instantly and stays light on phones.
 * Scroll position arrives through `journey` (lib/journey.ts).
 */

type Props = { mobile: boolean; reduced: boolean; active: boolean };

/** Deterministic pseudo-random numbers, so the scene looks the same on every render. */
function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function Scene({ mobile, reduced, active }: Props) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={mobile ? [1, 1.5] : [1, 2]}
      shadows={!mobile}
      camera={{ fov: 35, near: 0.1, far: 60, position: [0, 1.2, 6.2] }}
      gl={{ antialias: !mobile, powerPreference: "high-performance", alpha: false }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor("#090909");
        scene.fog = new THREE.Fog("#090909", 9, 22);
      }}
    >
      <Environment />
      <Lights mobile={mobile} />
      <Rig mobile={mobile} reduced={reduced} />
      <Dust count={mobile ? 160 : 520} reduced={reduced} />
    </Canvas>
  );
}

/* ---------- light & reflections ---------- */

function Environment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const tex = pmrem.fromScene(room, 0.04).texture;
    scene.environment = tex;
    scene.environmentIntensity = 0.55;
    return () => {
      scene.environment = null;
      tex.dispose();
      pmrem.dispose();
      room.dispose();
    };
  }, [gl, scene]);
  return null;
}

function Lights({ mobile }: { mobile: boolean }) {
  const key = useRef<THREE.SpotLight>(null);
  const rim = useRef<THREE.DirectionalLight>(null);
  useFrame(() => {
    const on = smooth(0.05, 0.55, journey.intro);
    if (key.current) key.current.intensity = 70 * on;
    if (rim.current) rim.current.intensity = 2.4 * on;
  });
  return (
    <>
      <ambientLight intensity={0.08} color="#f5e6c8" />
      <spotLight
        ref={key}
        position={[3.2, 6.5, 3.5]}
        angle={0.42}
        penumbra={0.85}
        decay={2}
        color="#ffe7c2"
        castShadow={!mobile}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-radius={6}
      />
      <directionalLight ref={rim} position={[-4, 2.5, -5]} color="#d6b477" />
      <pointLight position={[0, -1.4, 3]} intensity={1.2} color="#80633d" distance={8} />
    </>
  );
}

/* ---------- poses per scroll stage ---------- */

type Pose = { cup: [number, number, number]; scale: number; cam: [number, number, number]; look: [number, number, number] };
const DESKTOP: Pose[] = [
  { cup: [0, -1.2, 0], scale: 0.84, cam: [0, 1.35, 6.8], look: [0, 0.8, 0] }, // hero
  { cup: [2.35, -0.75, 0], scale: 0.8, cam: [-1.1, 2.3, 6.2], look: [0.65, 0, 0] }, // story
  { cup: [-2.0, -0.85, 0], scale: 1.0, cam: [1.2, 0.95, 6.0], look: [-0.6, 0, 0] }, // signature
  { cup: [0, -0.35, 0], scale: 0.72, cam: [0, 0.75, 7.4], look: [0, 0.65, 0] }, // anatomy
];
const MOBILE: Pose[] = [
  { cup: [0, -1.25, 0], scale: 0.74, cam: [0, 1.4, 7.8], look: [0, 1.15, 0] },
  { cup: [0, -0.35, 0], scale: 0.72, cam: [-1.0, 2.4, 7.4], look: [0, 0, 0] },
  { cup: [0, -0.4, 0], scale: 0.82, cam: [1.0, 1.0, 7.2], look: [0, 0.1, 0] },
  { cup: [0, 0.35, 0], scale: 0.68, cam: [0, 0.9, 8.6], look: [0, 0.9, 0] },
];

function poseAt(poses: Pose[], stage: number, out: Pose) {
  const s = Math.min(poses.length - 1, Math.max(0, stage));
  const i = Math.min(poses.length - 2, Math.floor(s));
  const f = smooth(0, 1, s - i);
  const a = poses[i];
  const b = poses[i + 1];
  for (let k = 0; k < 3; k++) {
    out.cup[k] = a.cup[k] + (b.cup[k] - a.cup[k]) * f;
    out.cam[k] = a.cam[k] + (b.cam[k] - a.cam[k]) * f;
    out.look[k] = a.look[k] + (b.look[k] - a.look[k]) * f;
  }
  out.scale = a.scale + (b.scale - a.scale) * f;
  return out;
}

/* ---------- camera + cup + ingredients, all driven by the journey ---------- */

function Rig({ mobile, reduced }: { mobile: boolean; reduced: boolean }) {
  const { camera } = useThree();
  const cup = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null); // the cup body, lifted off the saucer in the anatomy view
  const target = useMemo<Pose>(() => ({ cup: [0, 0, 0], scale: 1, cam: [0, 0, 0], look: [0, 0, 0] }), []);
  const cur = useRef({ cup: new THREE.Vector3(0, -1, 0), scale: 1, cam: new THREE.Vector3(0, 1.2, 6.4), look: new THREE.Vector3(), stage: 0 });
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05);
    const t = reduced ? 0 : state.clock.elapsedTime;
    const c = cur.current;
    c.stage = THREE.MathUtils.damp(c.stage, journey.stage, 4, d);
    poseAt(mobile ? MOBILE : DESKTOP, c.stage, target);

    const lam = 3.2;
    c.cup.x = THREE.MathUtils.damp(c.cup.x, target.cup[0], lam, d);
    c.cup.y = THREE.MathUtils.damp(c.cup.y, target.cup[1], lam, d);
    c.cup.z = THREE.MathUtils.damp(c.cup.z, target.cup[2], lam, d);
    c.scale = THREE.MathUtils.damp(c.scale, target.scale, lam, d);
    c.cam.x = THREE.MathUtils.damp(c.cam.x, target.cam[0], lam, d);
    c.cam.y = THREE.MathUtils.damp(c.cam.y, target.cam[1], lam, d);
    c.cam.z = THREE.MathUtils.damp(c.cam.z, target.cam[2], lam, d);
    c.look.x = THREE.MathUtils.damp(c.look.x, target.look[0], lam, d);
    c.look.y = THREE.MathUtils.damp(c.look.y, target.look[1], lam, d);
    c.look.z = THREE.MathUtils.damp(c.look.z, target.look[2], lam, d);

    // Opening: the cup rises into frame while the camera sweeps round to face it.
    const enter = smooth(0.32, 1, journey.intro);
    const ease = 1 - Math.pow(1 - enter, 3);
    const sweep = (1 - ease) * -0.9 + (reduced ? 0 : Math.sin(t * 0.12) * 0.22 * (1 - smooth(0.5, 1.5, c.stage)));

    // camera: orbit around the look point, plus a little pointer parallax
    tmp.copy(c.cam).sub(c.look);
    tmp.applyAxisAngle(THREE.Object3D.DEFAULT_UP, sweep);
    tmp.add(c.look);
    if (!mobile && !reduced) {
      tmp.x += journey.pointerX * 0.28;
      tmp.y += journey.pointerY * 0.16;
    }
    camera.position.copy(tmp);
    camera.lookAt(c.look);

    if (cup.current) {
      cup.current.position.set(c.cup.x, c.cup.y - (1 - ease) * 2.6, c.cup.z);
      cup.current.scale.setScalar(c.scale * (0.7 + 0.3 * ease));
      // slow turn while idle; scrolling through the stages turns it further
      cup.current.rotation.y = -0.5 + c.stage * 0.9 + (1 - ease) * 2.4 + t * 0.06 + journey.explode * Math.PI * 1.2;
      cup.current.rotation.z = reduced ? 0 : Math.sin(t * 0.5) * 0.015;
      cup.current.position.y += reduced ? 0 : Math.sin(t * 0.9) * 0.025;
    }
    if (lid.current) {
      const lift = smooth(2.5, 3, c.stage) * smooth(0, 0.5, journey.explode);
      lid.current.position.y = lift * 0.45;
    }
  });

  return (
    <>
      <group ref={cup}>
        <CupAndSaucer lidRef={lid} mobile={mobile} reduced={reduced} />
      </group>
      <Ingredients cupRef={cup} mobile={mobile} reduced={reduced} />
      {!mobile && (
        <mesh rotation-x={-Math.PI / 2} position={[0, -1.06, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <shadowMaterial opacity={0.55} />
        </mesh>
      )}
    </>
  );
}

/* ---------- the cup ---------- */

const v = (pts: number[][]) => pts.map(([x, y]) => new THREE.Vector2(x, y));

function CupAndSaucer({ lidRef, mobile, reduced }: { lidRef: React.RefObject<THREE.Group | null>; mobile: boolean; reduced: boolean }) {
  const seg = mobile ? 48 : 96;
  const geo = useMemo(() => {
    const cup = new THREE.LatheGeometry(
      v([
        [0, 0], [0.36, 0], [0.4, 0.015], [0.42, 0.06], [0.47, 0.2], [0.555, 0.44], [0.625, 0.69],
        [0.665, 0.89], [0.678, 0.952], [0.668, 0.963], [0.648, 0.945], [0.612, 0.72], [0.545, 0.47],
        [0.455, 0.225], [0.385, 0.1], [0, 0.09],
      ]),
      seg,
    );
    const saucer = new THREE.LatheGeometry(
      v([
        [0, 0], [0.5, 0], [0.55, 0.028], [0.9, 0.07], [1.15, 0.12], [1.222, 0.162], [1.208, 0.172],
        [1.12, 0.142], [0.88, 0.096], [0.56, 0.062], [0, 0.056],
      ]),
      seg,
    );
    cup.computeVertexNormals();
    saucer.computeVertexNormals();
    const handle = new THREE.TorusGeometry(0.2, 0.038, 18, 48, Math.PI * 1.3);
    return { cup, saucer, handle };
  }, [seg]);

  const mats = useMemo(
    () => ({
      porcelain: new THREE.MeshPhysicalMaterial({ color: "#f3ede2", roughness: 0.3, clearcoat: 0.85, clearcoatRoughness: 0.12, sheen: 0.3, sheenColor: new THREE.Color("#fff5e0") }),
      gold: new THREE.MeshStandardMaterial({ color: "#d6b477", metalness: 1, roughness: 0.26, envMapIntensity: 1.6 }),
      tea: new THREE.MeshPhysicalMaterial({ color: "#6e3816", roughness: 0.05, clearcoat: 1, clearcoatRoughness: 0.05 }),
    }),
    [],
  );

  useEffect(
    () => () => {
      Object.values(geo).forEach((g) => g.dispose());
      Object.values(mats).forEach((m) => m.dispose());
    },
    [geo, mats],
  );

  return (
    <group>
      {/* saucer */}
      <mesh geometry={geo.saucer} material={mats.porcelain} castShadow receiveShadow />
      <mesh material={mats.gold} position={[0, 0.167, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[1.214, 0.009, 10, seg * 2]} />
      </mesh>
      <mesh material={mats.gold} position={[0, 0.062, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.62, 0.006, 8, seg]} />
      </mesh>

      {/* cup (lifts away from the saucer in the anatomy view) */}
      <group ref={lidRef}>
        <group position={[0, 0.062, 0]}>
          <mesh geometry={geo.cup} material={mats.porcelain} castShadow receiveShadow />
          <mesh material={mats.gold} position={[0, 0.958, 0]} rotation-x={Math.PI / 2}>
            <torusGeometry args={[0.671, 0.011, 10, seg * 2]} />
          </mesh>
          <mesh material={mats.gold} position={[0, 0.05, 0]} rotation-x={Math.PI / 2}>
            <torusGeometry args={[0.415, 0.008, 8, seg]} />
          </mesh>
          <mesh geometry={geo.handle} material={mats.gold} position={[0.7, 0.55, 0]} rotation-z={-Math.PI * 0.65} castShadow />
          <mesh material={mats.tea} position={[0, 0.84, 0]} rotation-x={-Math.PI / 2}>
            <circleGeometry args={[0.627, seg]} />
          </mesh>
          <Steam count={mobile ? 4 : 7} reduced={reduced} />
        </group>
      </group>
    </group>
  );
}

/* ---------- steam ---------- */

function softTexture(inner = "rgba(255,248,235,1)", outer = "rgba(255,248,235,0)") {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, inner);
  grad.addColorStop(1, outer);
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function Steam({ count, reduced }: { count: number; reduced: boolean }) {
  const tex = useMemo(() => softTexture(), []);
  const sprites = useRef<(THREE.Sprite | null)[]>([]);
  const seeds = useMemo(() => {
    const r = seeded(7);
    return Array.from({ length: count }, (_, i) => ({ off: i / count, x: (r() - 0.5) * 0.3, z: (r() - 0.5) * 0.3 }));
  }, [count]);
  useEffect(() => () => tex.dispose(), [tex]);
  useFrame((state) => {
    const t = reduced ? 1.3 : state.clock.elapsedTime;
    const vis = smooth(0.6, 1, journey.intro) * (1 - smooth(2.5, 3, journey.stage) * smooth(0, 0.3, journey.explode));
    seeds.forEach((s, i) => {
      const sp = sprites.current[i];
      if (!sp) return;
      const p = (t * 0.18 + s.off) % 1;
      sp.position.set(s.x + Math.sin(t * 0.7 + i) * 0.12 * p, 0.95 + p * 1.1, s.z);
      const sc = 0.25 + p * 0.6;
      sp.scale.set(sc, sc * 1.5, 1);
      (sp.material as THREE.SpriteMaterial).opacity = Math.sin(p * Math.PI) * 0.075 * vis;
    });
  });
  return (
    <>
      {seeds.map((_, i) => (
        <sprite key={i} ref={(el) => { sprites.current[i] = el; }}>
          <spriteMaterial map={tex} transparent depthWrite={false} opacity={0} color="#fff4e2" />
        </sprite>
      ))}
    </>
  );
}

/* ---------- gold dust ---------- */

function Dust({ count, reduced }: { count: number; reduced: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const tex = useMemo(() => softTexture("rgba(255,236,190,1)", "rgba(214,180,119,0)"), []);
  const { positions, speeds } = useMemo(() => {
    const rnd = seeded(42);
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rnd() - 0.5) * 14;
      positions[i * 3 + 1] = (rnd() - 0.5) * 8;
      positions[i * 3 + 2] = (rnd() - 0.5) * 9 - 1;
      speeds[i] = 0.04 + rnd() * 0.12;
    }
    return { positions, speeds };
  }, [count]);
  useEffect(() => () => tex.dispose(), [tex]);
  useFrame((state, dt) => {
    const p = ref.current;
    if (!p) return;
    (p.material as THREE.PointsMaterial).opacity = 0.75 * smooth(0, 0.6, journey.intro);
    if (reduced) return;
    const arr = p.geometry.attributes.position.array as Float32Array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i] * Math.min(dt, 0.05);
      arr[i * 3] += Math.sin(t * 0.3 + i) * 0.0008;
      if (arr[i * 3 + 1] > 4) arr[i * 3 + 1] = -4;
    }
    p.geometry.attributes.position.needsUpdate = true;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial map={tex} size={0.05} sizeAttenuation transparent depthWrite={false} blending={THREE.AdditiveBlending} color="#d6b477" opacity={0} />
    </points>
  );
}

/* ---------- floating ingredients ---------- */

// Ingredient groups follow content/brand.ts → ingredients (same order):
// 0 tea leaves, 1 cardamom, 2 ginger, 3 cinnamon, 4 star anise, 5 sugar
const KINDS = [
  { group: 0, n: 4 },
  { group: 1, n: 3 },
  { group: 2, n: 2 },
  { group: 3, n: 2 },
  { group: 4, n: 2 },
  { group: 5, n: 2 },
];

function leafShape() {
  const s = new THREE.Shape();
  s.moveTo(0, -1);
  s.quadraticCurveTo(0.62, -0.1, 0, 1);
  s.quadraticCurveTo(-0.62, -0.1, 0, -1);
  return s;
}
function starShape(points = 8) {
  const s = new THREE.Shape();
  for (let i = 0; i <= points * 2; i++) {
    const r = i % 2 === 0 ? 1 : 0.38;
    const a = (i / (points * 2)) * Math.PI * 2;
    if (i === 0) s.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else s.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  return s;
}

function Ingredients({ cupRef, mobile, reduced }: { cupRef: React.RefObject<THREE.Group | null>; mobile: boolean; reduced: boolean }) {
  const parts = useMemo(() => {
    const ext = { depth: 0.18, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 2 };
    const geos = [
      new THREE.ExtrudeGeometry(leafShape(), ext),
      new THREE.SphereGeometry(1, 18, 14),
      new THREE.CylinderGeometry(1, 1, 0.26, 24),
      new THREE.CylinderGeometry(1, 1, 1, 16),
      new THREE.ExtrudeGeometry(starShape(), { ...ext, depth: 0.22 }),
      new THREE.BoxGeometry(1, 1, 1, 1, 1, 1),
    ];
    const scales: [number, number, number][] = [
      [0.13, 0.13, 0.13],
      [0.055, 0.095, 0.055],
      [0.1, 0.1, 0.1],
      [0.036, 0.42, 0.036],
      [0.11, 0.11, 0.11],
      [0.11, 0.11, 0.11],
    ];
    const mats = [
      new THREE.MeshStandardMaterial({ color: "#3d4a22", roughness: 0.45, metalness: 0.05 }),
      new THREE.MeshStandardMaterial({ color: "#9ba567", roughness: 0.7 }),
      new THREE.MeshStandardMaterial({ color: "#dcbf8c", roughness: 0.75 }),
      new THREE.MeshStandardMaterial({ color: "#7b4526", roughness: 0.85 }),
      new THREE.MeshStandardMaterial({ color: "#5c2f1b", roughness: 0.6 }),
      new THREE.MeshPhysicalMaterial({ color: "#fbf7ef", roughness: 0.85, sheen: 0.4 }),
    ];
    const items: { kind: number; idx: number; r: number; h: number; phase: number; speed: number; spin: THREE.Vector3; jitter: THREE.Vector3 }[] = [];
    const rnd = seeded(11);
    let k = 0;
    KINDS.forEach(({ group, n }) => {
      for (let i = 0; i < n; i++, k++) {
        items.push({
          kind: group,
          idx: i,
          r: 1.85 + ((k * 37) % 7) * 0.12,
          h: 0.1 + ((k * 53) % 9) * 0.17,
          phase: (k / 15) * Math.PI * 2,
          speed: 0.16 + ((k * 17) % 5) * 0.03,
          spin: new THREE.Vector3(rnd(), rnd(), rnd()).multiplyScalar(0.8),
          jitter: new THREE.Vector3((i - (n - 1) / 2) * 0.32, Math.sin(i * 2.1) * 0.14, Math.cos(i * 1.7) * 0.25),
        });
      }
    });
    return { geos, scales, mats, items };
  }, []);

  useEffect(
    () => () => {
      parts.geos.forEach((g) => g.dispose());
      parts.mats.forEach((m) => m.dispose());
    },
    [parts],
  );

  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const orbit = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const t = reduced ? 0 : state.clock.elapsedTime;
    const cup = cupRef.current;
    if (!cup) return;
    const show = smooth(1.3, 1.95, journey.stage);
    const ex = smooth(2.45, 3, journey.stage) * smooth(0, 0.55, journey.explode);
    parts.items.forEach((it, i) => {
      const m = refs.current[i];
      if (!m) return;
      // orbit around the cup
      const a = it.phase + t * it.speed;
      orbit.set(Math.cos(a) * it.r, it.h + Math.sin(t * 0.8 + it.phase) * 0.08, Math.sin(a) * it.r);
      orbit.multiplyScalar(cup.scale.x).add(cup.position);
      // exploded "anatomy" layout: three groups on each side of the cup (mobile: a ring above)
      if (mobile) {
        const ang = (it.kind / 6) * Math.PI * 2 + it.idx * 0.32 - Math.PI / 2;
        tmp.set(Math.cos(ang) * 1.4, 0.75 + Math.sin(ang) * 0.85, 0.3 + it.jitter.z);
      } else {
        const side = it.kind < 3 ? -1 : 1;
        const row = it.kind % 3;
        tmp.set(side * 1.6 + it.jitter.x * 0.45, 1.3 - row * 0.8 + it.jitter.y * 0.6, it.jitter.z * 0.5);
      }
      m.position.lerpVectors(orbit, tmp, ex);
      m.rotation.set(t * it.spin.x + i, t * it.spin.y + i * 0.7, t * it.spin.z);
      const s = parts.scales[it.kind];
      const k = show * (1 + ex * 0.35);
      m.scale.set(s[0] * k, s[1] * k, s[2] * k);
      m.visible = show > 0.01;
    });
  });

  return (
    <>
      {parts.items.map((it, i) => (
        <mesh
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          geometry={parts.geos[it.kind]}
          material={parts.mats[it.kind]}
          castShadow={!mobile}
          visible={false}
        />
      ))}
    </>
  );
}
