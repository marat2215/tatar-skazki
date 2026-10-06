"use client";

// Объёмная 3D-сцена: башня Сююмбике, кремлёвская стена, Кул Шариф.
// Камера облетает башню и поднимается вместе с игроком (floor 0..8); небо светлеет от ночи к рассвету.
import { useEffect, useRef } from "react";
import * as THREE from "three";

const SKIES: [string, string, string][] = [
  // [верх, горизонт, солнце]
  ["#2a2f70", "#c86a7a", "#ffb070"],
  ["#2e3a80", "#d07a7a", "#ffb070"],
  ["#1e2a6a", "#8a4a7a", "#ffa060"],
  ["#2a3a8a", "#c0607a", "#ffa050"],
  ["#3a5aa8", "#e8806a", "#ffb050"],
  ["#4a78c0", "#f8a070", "#ffc060"],
  ["#5a90d0", "#ffc080", "#ffd070"],
  ["#6aa8e0", "#ffd8a0", "#ffe080"],
  ["#7ec0f0", "#ffe8c0", "#fff0a0"],
];

function brickTexture(lit: boolean) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = "#e8d8c8";
  g.fillRect(0, 0, 256, 256);
  const bh = 16, bw = 40;
  for (let r = 0; r < 256 / bh; r++) {
    for (let k = -1; k < 256 / bw + 1; k++) {
      const x = k * bw + (r % 2 ? bw / 2 : 0);
      const v = Math.random() * 30 - 15;
      g.fillStyle = lit ? `rgb(${210 + v},${100 + v},${70 + v})` : `rgb(${168 + v},${62 + v},${44 + v})`;
      g.fillRect(x + 1.5, r * bh + 1.5, bw - 3, bh - 3);
      g.fillStyle = "rgba(0,0,0,.08)";
      g.fillRect(x + 1.5, r * bh + bh - 5, bw - 3, 3);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function archShape(w: number, h: number) {
  const s = new THREE.Shape();
  s.moveTo(-w / 2, 0);
  s.lineTo(-w / 2, h - w / 2);
  s.absarc(0, h - w / 2, w / 2, Math.PI, 0, true);
  s.lineTo(w / 2, 0);
  s.lineTo(-w / 2, 0);
  return s;
}

type Tier = { kind: "box" | "oct"; size: number; h: number };
const TIERS: Tier[] = [
  { kind: "box", size: 6.2, h: 4.2 },
  { kind: "box", size: 5.0, h: 3.4 },
  { kind: "box", size: 4.1, h: 2.9 },
  { kind: "oct", size: 1.95, h: 2.3 },
  { kind: "oct", size: 1.6, h: 1.9 },
  { kind: "oct", size: 1.3, h: 1.6 },
  { kind: "oct", size: 1.05, h: 1.3 },
];

function buildTower(floor: number) {
  const group = new THREE.Group();
  const brick = brickTexture(false), brickLit = brickTexture(true);
  const white = new THREE.MeshStandardMaterial({ color: "#f6efe4", roughness: 0.7 });
  const winOff = new THREE.MeshStandardMaterial({ color: "#2a1838", roughness: 0.4, metalness: 0.2 });
  const winOn = new THREE.MeshStandardMaterial({ color: "#ffd98a", emissive: "#ffb43c", emissiveIntensity: 1.6 });
  const tierYs: number[] = [];
  let y = 0;
  TIERS.forEach((t, k) => {
    const on = k < floor;
    const tex = (on ? brickLit : brick).clone();
    tex.needsUpdate = true;
    const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92, bumpMap: tex, bumpScale: 0.6 });
    let geo: THREE.BufferGeometry;
    if (t.kind === "box") {
      geo = new THREE.BoxGeometry(t.size, t.h, t.size);
      tex.repeat.set(t.size / 1.6, t.h / 1.6);
    } else {
      geo = new THREE.CylinderGeometry(t.size, t.size * 1.04, t.h, 8);
      tex.repeat.set((t.size * 6.3) / 1.6, t.h / 1.6);
    }
    const m = new THREE.Mesh(geo, mat);
    m.position.y = y + t.h / 2;
    m.castShadow = m.receiveShadow = true;
    if (t.kind === "oct") m.rotation.y = Math.PI / 8;
    group.add(m);
    tierYs.push(y + t.h / 2);
    // карниз
    const corn = t.kind === "box"
      ? new THREE.Mesh(new THREE.BoxGeometry(t.size + 0.5, 0.28, t.size + 0.5), white)
      : new THREE.Mesh(new THREE.CylinderGeometry(t.size + 0.22, t.size + 0.22, 0.24, 8), white);
    corn.position.y = y + t.h + 0.12;
    if (t.kind === "oct") corn.rotation.y = Math.PI / 8;
    corn.castShadow = true;
    group.add(corn);
    // окна-арки на каждой грани
    const faces = t.kind === "box" ? 4 : 8;
    const perFace = t.kind === "box" ? (k === 0 ? 3 : 2) : 1;
    const ww = t.kind === "box" ? Math.min(0.75, t.size / 6) : t.size * 0.42;
    const wh = Math.min(t.h * 0.55, ww * 2.3);
    const geoW = new THREE.ShapeGeometry(archShape(ww, wh));
    const apothem = t.kind === "box" ? t.size / 2 + 0.02 : t.size * Math.cos(Math.PI / 8) + 0.03;
    for (let f = 0; f < faces; f++) {
      const ang = (f / faces) * Math.PI * 2;
      for (let j = 0; j < perFace; j++) {
        if (k === 0 && j === 1) continue; // середина нижнего яруса — проезд
        const off = perFace === 1 ? 0 : (j - (perFace - 1) / 2) * (t.size / perFace);
        const w = new THREE.Mesh(geoW, on ? winOn : winOff);
        const frame = new THREE.Mesh(new THREE.ShapeGeometry(archShape(ww + 0.18, wh + 0.12)), white);
        [frame, w].forEach((mesh, d) => {
          mesh.position.set(Math.sin(ang) * (apothem + d * 0.01) + Math.cos(ang) * off, y + t.h * 0.25 - (d ? 0 : 0.06), Math.cos(ang) * (apothem + d * 0.01) - Math.sin(ang) * off);
          mesh.rotation.y = ang;
          group.add(mesh);
        });
      }
    }
    // проезд-арка в основании
    if (k === 0) {
      for (let f = 0; f < 4; f++) {
        const ang = (f / 4) * Math.PI * 2;
        const a = new THREE.Mesh(new THREE.ShapeGeometry(archShape(1.7, 2.9)), new THREE.MeshStandardMaterial({ color: "#140a18" }));
        a.position.set(Math.sin(ang) * (t.size / 2 + 0.03), 0, Math.cos(ang) * (t.size / 2 + 0.03));
        a.rotation.y = ang;
        group.add(a);
      }
    }
    y += t.h + 0.24;
  });
  // зелёный шатёр
  const spireMat = new THREE.MeshStandardMaterial({ color: floor >= 8 ? "#3fd88a" : "#1f8a55", roughness: 0.35, metalness: 0.35 });
  const spire = new THREE.Mesh(new THREE.ConeGeometry(1.15, 5.2, 8), spireMat);
  spire.position.y = y + 2.6;
  spire.rotation.y = Math.PI / 8;
  spire.castShadow = true;
  group.add(spire);
  // золотой шпиль и полумесяц
  const gold = new THREE.MeshStandardMaterial({ color: "#ffcf4a", metalness: 1, roughness: 0.25, emissive: floor >= 8 ? "#ffb000" : "#000000", emissiveIntensity: 0.6 });
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.2), gold);
  rod.position.y = y + 5.7;
  group.add(rod);
  [0.42, 0.3].forEach((r, i) => {
    const ball = new THREE.Mesh(new THREE.SphereGeometry(i ? 0.14 : 0.2, 16, 12), gold);
    ball.position.y = y + 5.25 + i * 0.4;
    group.add(ball);
    void r;
  });
  const cres = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.08, 10, 32, Math.PI * 1.35), gold);
  cres.position.y = y + 6.6;
  cres.rotation.z = Math.PI * 1.32;
  group.add(cres);
  tierYs.push(y + 2);
  group.rotation.z = 0.025; // наклон башни
  return { group, tierYs, top: y + 7 };
}

function buildCity() {
  const g = new THREE.Group();
  const wallMat = new THREE.MeshStandardMaterial({ color: "#f2ebe0", roughness: 0.85 });
  const roofMat = new THREE.MeshStandardMaterial({ color: "#2f7a52", roughness: 0.5, metalness: 0.2 });
  const blue = new THREE.MeshStandardMaterial({ color: "#3a9ad8", roughness: 0.3, metalness: 0.4 });
  // кремлёвская стена полукругом
  const R = 30;
  for (let a = -1.2; a <= 1.2; a += 0.06) {
    const seg = new THREE.Mesh(new THREE.BoxGeometry(2.0, 3.2, 1.2), wallMat);
    seg.position.set(Math.sin(a) * R, 1.6, -Math.cos(a) * R);
    seg.rotation.y = -a;
    seg.castShadow = seg.receiveShadow = true;
    g.add(seg);
    const mer = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.8, 1.2), wallMat);
    mer.position.set(Math.sin(a) * R, 3.6, -Math.cos(a) * R);
    mer.rotation.y = -a;
    g.add(mer);
  }
  [-1.1, -0.45, 0.45, 1.1].forEach((a) => {
    const t = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 6, 16), wallMat);
    t.position.set(Math.sin(a) * R, 3, -Math.cos(a) * R);
    t.castShadow = true;
    g.add(t);
    const r = new THREE.Mesh(new THREE.ConeGeometry(1.9, 3.4, 16), roofMat);
    r.position.set(Math.sin(a) * R, 7.7, -Math.cos(a) * R);
    g.add(r);
  });
  // Кул Шариф: голубой купол и 4 минарета
  const ks = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(8, 6, 8), wallMat);
  base.position.y = 3;
  ks.add(base);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(3.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 1.7), blue);
  dome.position.y = 6.4;
  dome.scale.y = 1.3;
  ks.add(dome);
  [[-4.6, -4.6], [4.6, -4.6], [-4.6, 4.6], [4.6, 4.6]].forEach(([x, z]) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.6, 16, 12), wallMat);
    m.position.set(x, 8, z);
    m.castShadow = true;
    ks.add(m);
    const c = new THREE.Mesh(new THREE.ConeGeometry(0.62, 3, 12), blue);
    c.position.set(x, 17.5, z);
    ks.add(c);
  });
  ks.position.set(-16, 0, -18);
  g.add(ks);
  // деревья
  const leaf = new THREE.MeshStandardMaterial({ color: "#2f6b3a", roughness: 0.9 });
  const trunk = new THREE.MeshStandardMaterial({ color: "#5a3a22" });
  for (let i = 0; i < 26; i++) {
    const a = Math.random() * Math.PI * 2, r = 40 + Math.random() * 10;
    const tr = new THREE.Group();
    const s = 0.8 + Math.random() * 0.8;
    const tk = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 1.4), trunk);
    tk.position.y = 0.7;
    const cr = new THREE.Mesh(new THREE.SphereGeometry(1.1, 12, 10), leaf);
    cr.position.y = 2;
    cr.castShadow = true;
    tr.add(tk, cr);
    tr.scale.setScalar(s);
    tr.position.set(Math.sin(a) * r, 0, Math.cos(a) * r);
    if (Math.abs(Math.sin(a) * r) < 5 && Math.cos(a) * r > 0) continue; // не загораживать камеру
    g.add(tr);
  }
  return g;
}

export function Tower3D({ floor, className, overview = false }: { floor: number; className?: string; overview?: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const floorRef = useRef(floor);
  const api = useRef<{ setFloor: (f: number) => void } | null>(null);

  useEffect(() => {
    floorRef.current = floor;
    api.current?.setFloor(floor);
  }, [floor]);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    } catch {
      return; // нет WebGL — останется CSS-фон
    }
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 400);

    // небо-градиент
    const skyU = { top: { value: new THREE.Color() }, bot: { value: new THREE.Color() } };
    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(200, 32, 16),
      new THREE.ShaderMaterial({
        side: THREE.BackSide, depthWrite: false, uniforms: skyU,
        vertexShader: "varying vec3 p; void main(){ p = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
        fragmentShader: "uniform vec3 top; uniform vec3 bot; varying vec3 p; void main(){ float h = clamp(p.y*1.6+0.15,0.0,1.0); gl_FragColor = vec4(mix(bot, top, pow(h,0.8)),1.0); }",
      }),
    );
    scene.add(sky);
    // солнце
    const sunTex = (() => {
      const c = document.createElement("canvas"); c.width = c.height = 128;
      const g = c.getContext("2d")!; const gr = g.createRadialGradient(64, 64, 4, 64, 64, 64);
      gr.addColorStop(0, "rgba(255,255,240,1)"); gr.addColorStop(0.25, "rgba(255,230,160,.9)"); gr.addColorStop(1, "rgba(255,200,120,0)");
      g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c);
    })();
    const sun = new THREE.Sprite(new THREE.SpriteMaterial({ map: sunTex, depthWrite: false, transparent: true }));
    sun.scale.set(40, 40, 1);
    scene.add(sun);

    const hemi = new THREE.HemisphereLight("#bcd4ff", "#4a3a2a", 0.9);
    scene.add(hemi);
    const dir = new THREE.DirectionalLight("#ffd8a8", 2.2);
    dir.castShadow = true;
    dir.shadow.mapSize.set(1024, 1024);
    Object.assign(dir.shadow.camera, { left: -20, right: 20, top: 30, bottom: -5, near: 1, far: 120 });
    scene.add(dir, dir.target);

    const ground = new THREE.Mesh(new THREE.CircleGeometry(140, 64), new THREE.MeshStandardMaterial({ color: "#5f8a46", roughness: 1 }));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    const plaza = new THREE.Mesh(new THREE.CircleGeometry(9, 48), new THREE.MeshStandardMaterial({ color: "#cfc2ae", roughness: 0.95 }));
    plaza.rotation.x = -Math.PI / 2;
    plaza.position.y = 0.02;
    plaza.receiveShadow = true;
    scene.add(plaza);
    scene.add(buildCity());

    // светлячки / искры
    const N = 160, pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - 0.5) * 30; pos[i * 3 + 1] = Math.random() * 30; pos[i * 3 + 2] = (Math.random() - 0.5) * 30; }
    const pg = new THREE.BufferGeometry(); pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const sparks = new THREE.Points(pg, new THREE.PointsMaterial({ color: "#ffe08a", size: 0.18, transparent: true, opacity: 0.85, depthWrite: false }));
    scene.add(sparks);

    let tower = buildTower(floorRef.current);
    scene.add(tower.group);
    let camY = 6, lookY = 5;
    const skyTop = new THREE.Color(), skyBot = new THREE.Color();

    const applyFloor = (f: number) => {
      scene.remove(tower.group);
      tower = buildTower(f);
      scene.add(tower.group);
      const s = SKIES[Math.max(0, Math.min(8, f))];
      skyTop.set(s[0]); skyBot.set(s[1]);
      sun.material.color.set(s[2]);
      sun.position.set(-60, 8 + f * 5, -120);
      dir.position.set(-30, 18 + f * 4, -10);
      dir.intensity = 1.2 + f * 0.25;
      hemi.intensity = 0.9 + f * 0.08;
      scene.fog = new THREE.Fog(s[1], 60, 190);
    };
    applyFloor(floorRef.current);
    skyU.top.value.copy(skyTop); skyU.bot.value.copy(skyBot);
    api.current = { setFloor: applyFloor };

    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, visible = true, t0 = performance.now();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(el);
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      const t = (now - t0) / 1000;
      const f = floorRef.current;
      if (overview) { lookY += (9 - lookY) * 0.05; camY += (7 - camY) * 0.05; }
      const targetLook = f >= 8 ? tower.top - 4 : tower.tierYs[Math.min(f, tower.tierYs.length - 1)] ?? 4;
      if (!overview) { lookY += (targetLook - lookY) * 0.03; camY += (targetLook + 2.5 - camY) * 0.03; }
      const ang = reduce ? 0.5 : 0.5 + t * 0.06;
      const dist = overview ? 34 : 17 + (f === 0 ? 5 : 0);
      camera.position.set(Math.sin(ang) * dist, Math.max(1.6, camY), Math.cos(ang) * dist);
      camera.lookAt(0, lookY, 0);
      skyU.top.value.lerp(skyTop, 0.05); skyU.bot.value.lerp(skyBot, 0.05);
      sparks.rotation.y = t * 0.05;
      (sparks.material as THREE.PointsMaterial).opacity = 0.5 + Math.sin(t * 2) * 0.3;
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      api.current = null;
      renderer.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
      });
      el.removeChild(renderer.domElement);
    };
  }, [overview]);

  return <div ref={host} className={className} style={{ background: "linear-gradient(#3b2a6a,#ffb27a)" }} aria-hidden />;
}
