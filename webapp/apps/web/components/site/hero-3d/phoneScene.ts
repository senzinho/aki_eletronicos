/**
 * "Assistência técnica" intro: a phone repair seen up close, part by part
 * (logic board, battery, flex cables, charging port, camera, speaker, screws, screen).
 * Loaded lazily by AssemblyHero (scene="phone") so three.js stays out of the main bundle.
 */
import * as THREE from 'three';
import { GREEN, GREEN_RGB, createStage, setOpacity, type StageConfig, type StageModel } from './stage';
import type { SceneDefinition } from './timeline';

export interface PhoneParts {
  back: THREE.Group;
  frame: THREE.Group;
  board: THREE.Group;
  bat: THREE.Group;
  flex: THREE.Group;
  port: THREE.Group;
  cam: THREE.Group;
  spk: THREE.Group;
  mic: THREE.Group;
  gasket: THREE.Group;
  screws: THREE.Group;
  sim: THREE.Group;
  screen: THREE.Group;
  scan: THREE.Group;
}

export interface PhoneModel extends StageModel {
  parts: PhoneParts;
  /** 0..1 screen power (black → lit) */
  scr: { v: number };
}

export function buildPhone(): PhoneModel {
  const group = new THREE.Group();
  const rgbMats: THREE.MeshStandardMaterial[] = [];
  const rgb = { v: 0 };
  const scr = { v: 0 };

  const mat = (c: number, o: THREE.MeshStandardMaterialParameters = {}) =>
    new THREE.MeshStandardMaterial({ color: c, metalness: 0.5, roughness: 0.45, transparent: true, ...o });
  const rgbM = () => {
    const m = mat(0x050505, { emissive: GREEN, emissiveIntensity: 0, metalness: 0, roughness: 0.6 });
    rgbMats.push(m);
    return m;
  };
  const box = (w: number, h: number, d: number, m: THREE.Material, x = 0, y = 0, z = 0) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    b.position.set(x, y, z);
    return b;
  };
  const cyl = (r: number, l: number, m: THREE.Material, x: number, y: number, z: number) => {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(r, r, l, 28).rotateX(Math.PI / 2), m);
    c.position.set(x, y, z);
    return c;
  };
  /** rounded-rectangle outline */
  const rr = (w: number, h: number, r: number) => {
    const s = new THREE.Shape();
    const x = -w / 2;
    const y = -h / 2;
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y);
    s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r);
    s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h);
    s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r);
    s.quadraticCurveTo(x, y, x + r, y);
    return s;
  };
  const extr = (shape: THREE.Shape, d: number, m: THREE.Material) => {
    const g = new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 2, curveSegments: 14 });
    g.translate(0, 0, -d / 2);
    return new THREE.Mesh(g, m);
  };
  const steel = () => mat(0x9aa3b0, { metalness: 0.65, roughness: 0.35 });
  const alu = () => mat(0x2a313b, { metalness: 0.7, roughness: 0.4 });
  const dark = () => mat(0x12161c, { metalness: 0.4, roughness: 0.5 });
  function tube(pts: number[][], r: number, m: THREE.Material) {
    const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(p[0], p[1], p[2]))), 48, r, 6, false);
    const mesh = new THREE.Mesh(geo, m);
    mesh.userData.count = geo.index!.count;
    geo.setDrawRange(0, 0);
    return mesh;
  }

  // back cover with camera island
  const back = new THREE.Group();
  back.add(extr(rr(1.5, 3.1, 0.22), 0.03, mat(0x1a2028, { metalness: 0.45, roughness: 0.28 })).translateZ(-0.095));
  back.add(box(0.64, 0.64, 0.04, mat(0x0f1318, { metalness: 0.5, roughness: 0.3 }), -0.42, 1.1, -0.115));

  // metal frame with side buttons
  const frame = new THREE.Group();
  const outer = rr(1.5, 3.1, 0.22);
  outer.holes.push(new THREE.Path(rr(1.42, 3.02, 0.18).getPoints(16)));
  frame.add(extr(outer, 0.14, steel()));
  frame.add(box(0.03, 0.5, 0.05, steel(), 0.77, 0.6, 0));
  frame.add(box(0.03, 0.3, 0.05, steel(), 0.77, 0, 0));
  frame.add(box(0.03, 0.3, 0.05, steel(), -0.77, 0.7, 0));

  // logic board
  const bc = document.createElement('canvas');
  bc.width = bc.height = 512;
  const bx = bc.getContext('2d')!;
  bx.fillStyle = '#0b0e12';
  bx.fillRect(0, 0, 512, 512);
  bx.strokeStyle = `rgba(${GREEN_RGB},.2)`;
  bx.lineWidth = 2;
  for (let i = 0; i < 46; i++) {
    bx.beginPath();
    let x = Math.random() * 512;
    let y = Math.random() * 512;
    bx.moveTo(x, y);
    for (let j = 0; j < 4; j++) {
      x += (Math.random() < 0.5 ? 1 : -1) * (20 + Math.random() * 80);
      bx.lineTo(x, y);
      y += (Math.random() < 0.5 ? 1 : -1) * (20 + Math.random() * 80);
      bx.lineTo(x, y);
    }
    bx.stroke();
  }
  const board = new THREE.Group();
  board.add(box(1.3, 2.4, 0.04, mat(0xffffff, { map: new THREE.CanvasTexture(bc), metalness: 0.25, roughness: 0.6 }), 0, 0.1, -0.04));
  board.add(box(0.44, 0.44, 0.05, steel(), 0.35, 0.95, 0));
  board.add(box(0.28, 0.28, 0.01, dark(), 0.35, 0.95, 0.03));
  const chips: [number, number, number, number][] = [[0, 0.8, 0.2, 0.16], [0, 0.58, 0.28, 0.12], [0.35, 0.62, 0.18, 0.14], [0.5, 0.4, 0.2, 0.12]];
  chips.forEach(([x, y, w, h]) => board.add(box(w, h, 0.035, alu(), x, y, -0.005)));

  // battery
  const bat = new THREE.Group();
  bat.add(box(1.18, 1.3, 0.07, mat(0x1c2733, { metalness: 0.4, roughness: 0.5 }), 0, -0.15, 0.045));
  bat.add(box(0.9, 0.1, 0.004, rgbM(), 0, 0.28, 0.083));
  bat.add(box(0.5, 0.05, 0.004, mat(0x8d95a3, { metalness: 0.2 }), -0.2, -0.1, 0.083));
  bat.add(box(0.3, 0.05, 0.004, mat(0x8d95a3, { metalness: 0.2 }), -0.3, -0.22, 0.083));

  // flex cables
  const flexM = () => mat(0xb8862f, { metalness: 0.45, roughness: 0.5 });
  const flex = new THREE.Group();
  [
    [[0.45, -0.5, 0.03], [0.62, -0.2, 0.075], [0.62, 0.3, 0.075], [0.5, 0.55, 0.04]],
    [[-0.3, -1.28, 0.0], [-0.5, -1.0, 0.06], [-0.62, -0.5, 0.075], [-0.62, 0.1, 0.07], [-0.55, 0.55, 0.04]],
    [[-0.42, 1.0, 0.0], [-0.1, 0.9, 0.045], [0.1, 0.72, 0.045]],
  ].forEach((pts) => flex.add(tube(pts, 0.018, flexM())));

  // charging port
  const port = new THREE.Group();
  port.add(box(0.9, 0.2, 0.03, dark(), 0, -1.3, -0.03));
  port.add(box(0.34, 0.1, 0.09, steel(), 0, -1.43, 0));
  port.add(box(0.26, 0.04, 0.095, mat(0x020202), 0, -1.43, 0));
  port.add(cyl(0.02, 0.1, rgbM(), 0.22, -1.3, 0.0));

  // camera module
  const cam = new THREE.Group();
  cam.add(box(0.5, 0.5, 0.06, dark(), -0.42, 1.1, -0.065));
  [[-0.54, 1.22], [-0.3, 1.22], [-0.54, 0.98]].forEach(([x, y]) => {
    cam.add(cyl(0.09, 0.06, mat(0x0a1a2a, { metalness: 0.9, roughness: 0.1 }), x, y, -0.14));
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.014, 10, 32), rgbM());
    ring.position.set(x, y, -0.172);
    cam.add(ring);
  });
  cam.add(cyl(0.035, 0.04, mat(0xf5e9c8, { emissive: 0x332a10, emissiveIntensity: 0.4, metalness: 0.1 }), -0.3, 0.98, -0.14));

  // speaker + microphone
  const spk = new THREE.Group();
  spk.add(box(0.46, 0.14, 0.06, dark(), -0.5, -1.42, 0.0));
  for (let i = 0; i < 6; i++) spk.add(box(0.018, 0.1, 0.065, steel(), -0.7 + i * 0.08, -1.42, 0));
  const mic = new THREE.Group();
  mic.add(cyl(0.045, 0.05, steel(), 0.55, -1.42, 0));
  const micRing = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.012, 8, 24), rgbM());
  micRing.position.set(0.55, -1.42, 0.03);
  mic.add(micRing);

  // gasket, screws and SIM tray
  const go = rr(1.44, 3.04, 0.19);
  go.holes.push(new THREE.Path(rr(1.36, 2.96, 0.15).getPoints(16)));
  const gasket = new THREE.Group();
  gasket.add(extr(go, 0.02, mat(0x050505, { metalness: 0.1, roughness: 0.9 })).translateZ(0.078));
  const screws = new THREE.Group();
  [[0.58, 1.25], [-0.62, 0.6], [0.58, 0.6], [-0.58, -0.95], [0.58, -0.95], [0, -0.95]].forEach(([x, y]) => {
    const s = new THREE.Group();
    s.add(cyl(0.035, 0.025, steel(), 0, 0, 0));
    s.add(box(0.05, 0.008, 0.005, mat(0x050505), 0, 0, 0.014));
    s.add(box(0.008, 0.05, 0.005, mat(0x050505), 0, 0, 0.014));
    s.position.set(x, y, 0.03);
    screws.add(s);
  });
  const sim = new THREE.Group();
  sim.add(box(0.05, 0.32, 0.05, alu(), 0.765, -0.7, 0));
  sim.add(box(0.01, 0.04, 0.05, steel(), 0.79, -0.58, 0));

  // screen: a lock screen painted on a canvas, in the site's body font
  const family = getComputedStyle(document.documentElement).getPropertyValue('--font-inter').trim();
  const font = (weight: number, px: number) => `${weight} ${px}px ${family ? `${family}, ` : ''}system-ui, sans-serif`;
  const dateRaw = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  const dateLabel = dateRaw.charAt(0).toUpperCase() + dateRaw.slice(1);
  const sc = document.createElement('canvas');
  sc.width = 560;
  sc.height = 1220;
  const sx = sc.getContext('2d')!;
  const stex = new THREE.CanvasTexture(sc);
  /** draws text, shrinking the font until it fits maxW */
  function fitText(text: string, weight: number, px: number, maxW: number, x: number, y: number) {
    sx.font = font(weight, px);
    const w = sx.measureText(text).width;
    if (w > maxW) sx.font = font(weight, Math.floor((px * maxW) / w));
    sx.fillText(text, x, y);
  }
  const rrect = (x: number, y: number, w: number, h: number, r: number) => {
    sx.beginPath();
    if (sx.roundRect) sx.roundRect(x, y, w, h, r);
    else sx.rect(x, y, w, h);
  };
  function drawScreen() {
    const W = 560;
    const H = 1220;
    const r = 46;
    sx.clearRect(0, 0, W, H);
    sx.save();
    sx.beginPath();
    sx.moveTo(r, 0);
    sx.arcTo(W, 0, W, H, r);
    sx.arcTo(W, H, 0, H, r);
    sx.arcTo(0, H, 0, 0, r);
    sx.arcTo(0, 0, W, 0, r);
    sx.closePath();
    sx.clip();
    let g = sx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#0a2a1c');
    g.addColorStop(0.55, '#04100b');
    g.addColorStop(1, '#02140a');
    sx.fillStyle = g;
    sx.fillRect(0, 0, W, H);
    g = sx.createRadialGradient(W / 2, H * 0.66, 10, W / 2, H * 0.66, 380);
    g.addColorStop(0, `rgba(${GREEN_RGB},.42)`);
    g.addColorStop(1, `rgba(${GREEN_RGB},0)`);
    sx.fillStyle = g;
    sx.fillRect(0, 0, W, H);
    sx.strokeStyle = `rgba(${GREEN_RGB},.14)`;
    sx.lineWidth = 2;
    for (let i = 1; i < 6; i++) {
      sx.beginPath();
      sx.arc(W / 2, H * 0.66, 50 + i * 62, 0, Math.PI * 2);
      sx.stroke();
    }
    // camera cut-out + status bar
    sx.fillStyle = '#000';
    rrect(W / 2 - 62, 24, 124, 36, 18);
    sx.fill();
    sx.fillStyle = '#F5F5F5';
    sx.textAlign = 'left';
    sx.font = font(600, 26);
    sx.fillText('09:41', 44, 52);
    sx.fillRect(W - 120, 38, 6, 10);
    sx.fillRect(W - 108, 32, 6, 16);
    sx.fillRect(W - 96, 26, 6, 22);
    sx.fillStyle = '#2fd35c';
    sx.fillRect(W - 74, 28, 34, 20);
    // clock + date
    sx.textAlign = 'center';
    sx.fillStyle = '#F5F5F5';
    fitText('09:41', 400, 190, 440, W / 2, 330);
    sx.fillStyle = '#b8c2bd';
    fitText(dateLabel, 500, 28, W - 80, W / 2, 386);
    // notification card
    sx.fillStyle = 'rgba(245,245,245,.1)';
    rrect(40, 640, W - 80, 128, 26);
    sx.fill();
    sx.fillStyle = '#2fd35c';
    sx.beginPath();
    sx.arc(82, 704, 10, 0, 7);
    sx.fill();
    sx.textAlign = 'left';
    sx.fillStyle = '#F5F5F5';
    fitText('Reparo concluído', 600, 30, W - 80 - 90, 108, 698);
    sx.fillStyle = '#aab5b0';
    fitText('Funcionando como novo.', 400, 24, W - 80 - 90, 108, 738);
    // dock buttons + home indicator
    sx.fillStyle = 'rgba(245,245,245,.12)';
    [[72, H - 120], [W - 72, H - 120]].forEach(([x, y]) => {
      sx.beginPath();
      sx.arc(x, y, 34, 0, 7);
      sx.fill();
    });
    sx.fillStyle = 'rgba(245,245,245,.65)';
    sx.fillRect(W / 2 - 90, H - 30, 180, 8);
    sx.restore();
    stex.needsUpdate = true;
  }
  drawScreen();
  // repaint once the site's font files are in (canvas can't wait for them by itself)
  if (document.fonts) {
    Promise.all([400, 500, 600].map((w) => document.fonts.load(font(w, 24)))).then(drawScreen, () => {});
  }

  const screen = new THREE.Group();
  screen.add(extr(rr(1.46, 3.06, 0.2), 0.03, mat(0x05070a, { metalness: 0.2, roughness: 0.12 })).translateZ(0.1));
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(1.34, 2.92), new THREE.MeshBasicMaterial({ map: stex, transparent: true, color: 0x000000 }));
  plane.position.z = 0.128;
  screen.add(plane);

  // diagnostic scan line
  const scan = new THREE.Group();
  scan.add(new THREE.Mesh(new THREE.PlaneGeometry(1.9, 0.03), new THREE.MeshBasicMaterial({ color: GREEN, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false })));
  scan.add(new THREE.Mesh(new THREE.PlaneGeometry(1.9, 0.55), new THREE.MeshBasicMaterial({ color: GREEN, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending, depthWrite: false })).translateY(-0.28));
  scan.position.z = 0.22;

  const parts: PhoneParts = { back, frame, board, bat, flex, port, cam, spk, mic, gasket, screws, sim, screen, scan };
  Object.values(parts).forEach((o) => {
    group.add(o);
    setOpacity(o, 0);
  });
  group.scale.setScalar(1.12);

  const hue = new THREE.Color();
  return {
    group,
    parts,
    rgb,
    scr,
    setOp: setOpacity,
    update(t) {
      rgbMats.forEach((m, i) => {
        hue.setHSL(0.36 + 0.07 * Math.sin(t * 0.5 + i * 0.6), 0.78, 0.52);
        m.emissive.copy(hue);
        m.emissiveIntensity = rgb.v * 1.8;
      });
      plane.material.color.setScalar(scr.v);
      group.position.y = Math.sin(t * 0.9) * 0.04;
    },
  };
}

const STAGE: StageConfig = {
  exposure: 0.95,
  ambient: 0.5,
  key: { intensity: 1.0, pos: [4, 6, 8] },
  rim: { pos: [-5, 2, -3] },
  fill: { pos: [5, -1, 6] },
  inner: { pos: [0, 0, 1.8], distance: 7, gain: 1.6 },
  floor: { y: -2.05, size: 14, divisions: 28, glow: 0.45 },
  beam: { radius: 2.8, height: 7, pos: [0, 1.4, -0.2], opacity: 0.05 },
  dust: { count: 160, spread: 11, yScale: 7, yMin: -2.2, size: 0.03 },
  camera: {
    ang: 0.75,
    h: 0.5,
    lookAtOffset: [0, 0, 0],
    parallaxY: 0.8,
    spin: 0.1,
    distance: (asp) => Math.max(8.4, (asp > 1.3 ? 3.9 : 5.2) / (0.65 * asp)),
    shift: { wide: 0.17, narrow: 0.23 },
  },
};

export const scene: SceneDefinition<PhoneModel> = {
  create: (canvas) => createStage(canvas, buildPhone, STAGE),

  timeline({ tl, S, mark, enter, draw, cam }) {
    const P = S.model.parts;
    const setOp = S.model.setOp;
    tl.to(S.lv, { v: 1, duration: 1.8, ease: 'power2.out' }, 0);
    cam(0.3, { ang: 0.45, h: 0.6, r: 0.95 }, 4.8, 'sine.inOut');
    mark(0, 0.3);
    enter(P.back, { z: -2.6 }, 0.3, 1.3);
    enter(P.frame, { z: 2.2 }, 0.8, 1.2);
    mark(1, 1.6);
    enter(P.board, { z: 2.6, y: 0.5 }, 1.6, 1.3);
    // the diagnostic scan sweeps down and back up over the board
    const sweep = { v: 0 };
    tl.to(
      sweep,
      {
        v: 2,
        duration: 2.2,
        ease: 'none',
        onUpdate: () => {
          const u = sweep.v <= 1 ? sweep.v : 2 - sweep.v;
          P.scan.position.y = -1.8 + u * 3.6;
          setOp(P.scan, Math.min(1, sweep.v * 4, (2 - sweep.v) * 4));
        },
      },
      3.2,
    );
    mark(2, 5.4);
    cam(5.2, { ang: 0.2, h: 0.7, r: 0.72, ly: -0.1 }, 1.4);
    enter(P.bat, { z: 2.6 }, 5.5, 1.1);
    mark(3, 7.4);
    cam(7.2, { ang: 0.3, h: 0.9, r: 0.7, ly: 0.15 }, 1.2);
    P.flex.children.forEach((m, i) => draw(m as THREE.Mesh, 7.6 + i * 0.3, 0.9));
    mark(4, 9.0);
    cam(8.9, { ang: 0.15, h: 0.2, r: 0.6, ly: -1.2 }, 1.2);
    enter(P.port, { y: -2.2 }, 9.1, 1);
    mark(5, 10.4);
    cam(10.3, { ang: -0.1, h: 1.0, r: 0.6, lx: -0.35, ly: 1.05 }, 1.2);
    enter(P.cam, { y: 2.2, z: -0.8 }, 10.5, 1.1);
    mark(6, 11.8);
    cam(11.7, { ang: 0.1, h: 0.1, r: 0.64, lx: 0, ly: -1.3 }, 1.2);
    enter(P.spk, { x: -2.4 }, 11.9, 0.9);
    enter(P.mic, { x: 2.4 }, 12.2, 0.9);
    mark(7, 13.2);
    cam(13.1, { ang: 0.3, h: 0.6, r: 0.8, lx: 0, ly: 0 }, 1.3);
    enter(P.gasket, { z: 1.2 }, 13.3, 0.8);
    P.screws.children.forEach((s, i) => enter(s, { z: 1.4, rz: 7 }, 13.8 + i * 0.15, 0.7));
    enter(P.sim, { x: 0.8 }, 14.6, 0.7);
    mark(8, 15.4);
    cam(15.3, { ang: 0.3, h: 0.5, r: 1 }, 1.3);
    enter(P.screen, { z: 3.2 }, 15.5, 1.5, 'power3.inOut');
    mark(9, 17.4);
    tl.to(S.model.scr, { v: 1, duration: 1.2, ease: 'power2.in' }, 17.6);
    tl.to(S.model.rgb, { v: 1, duration: 1.6, ease: 'power2.inOut' }, 17.4);
    mark(10, 19.4);
    cam(19.4, { ang: 0.3 + Math.PI * 2, h: 0.7, r: 1 }, 5.2);
    return { doneAt: 20.8, timeScale: 1.2 };
  },
};
