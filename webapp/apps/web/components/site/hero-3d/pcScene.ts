/**
 * "Montagem de PC" intro: a gaming PC assembles itself part by part in 3D.
 * Loaded lazily by AssemblyHero (scene="pc") so three.js stays out of the main bundle.
 */
import * as THREE from 'three';
import { GREEN, GREEN_RGB, createStage, setOpacity, type StageConfig, type StageModel } from './stage';
import type { SceneDefinition } from './timeline';

export interface PcParts {
  board: THREE.Group;
  cpu: THREE.Group;
  ram: THREE.Group[];
  ssd: THREE.Group;
  gpu: THREE.Group;
  psu: THREE.Group;
  pump: THREE.Group;
  rad: THREE.Group;
  tubes: THREE.Mesh[];
  fans: THREE.Group[];
  cables: THREE.Mesh[];
  case: THREE.Group;
}

export interface PcModel extends StageModel {
  parts: PcParts;
}

type Mat = THREE.MeshStandardMaterial;

export function buildPC(): PcModel {
  const group = new THREE.Group();
  const fans: THREE.Group[] = [];
  const rgbMats: Mat[] = [];
  const rgb = { v: 0 };

  const mat = (c: number, o: THREE.MeshStandardMaterialParameters = {}) =>
    new THREE.MeshStandardMaterial({ color: c, metalness: 0.45, roughness: 0.5, transparent: true, ...o });
  const M = {
    dark: () => mat(0x161a21),
    black: () => mat(0x0a0b0e, { metalness: 0.3, roughness: 0.65 }),
    steel: () => mat(0x9aa3af, { metalness: 0.8, roughness: 0.32 }),
    alu: () => mat(0x2a303a, { metalness: 0.7, roughness: 0.4 }),
  };
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

  function fan(r: number) {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.TorusGeometry(r, r * 0.08, 8, 40), M.black()));
    g.add(new THREE.Mesh(new THREE.TorusGeometry(r * 0.86, r * 0.035, 8, 40), rgbM()));
    const rotor = new THREE.Group();
    for (let i = 0; i < 9; i++) {
      const arm = new THREE.Group();
      arm.rotation.z = (i / 9) * Math.PI * 2;
      const b = box(r * 0.72, r * 0.28, 0.012, M.dark(), r * 0.5, 0, 0);
      b.rotation.x = 0.55;
      arm.add(b);
      rotor.add(arm);
    }
    rotor.add(new THREE.Mesh(new THREE.CylinderGeometry(r * 0.26, r * 0.26, 0.04, 20).rotateX(Math.PI / 2), M.alu()));
    g.add(rotor);
    fans.push(rotor);
    return g;
  }

  // motherboard texture (procedural PCB traces)
  const bc = document.createElement('canvas');
  bc.width = bc.height = 1024;
  const bx = bc.getContext('2d')!;
  bx.fillStyle = '#0c0f13';
  bx.fillRect(0, 0, 1024, 1024);
  bx.strokeStyle = `rgba(${GREEN_RGB},.16)`;
  bx.lineWidth = 2;
  for (let i = 0; i < 70; i++) {
    bx.beginPath();
    let x = Math.random() * 1024;
    let y = Math.random() * 1024;
    bx.moveTo(x, y);
    for (let j = 0; j < 4; j++) {
      x += (Math.random() < 0.5 ? 1 : -1) * (30 + Math.random() * 120);
      bx.lineTo(x, y);
      y += (Math.random() < 0.5 ? 1 : -1) * (30 + Math.random() * 120);
      bx.lineTo(x, y);
    }
    bx.stroke();
  }
  bx.fillStyle = 'rgba(180,190,200,.35)';
  for (let i = 0; i < 160; i++) bx.fillRect(Math.random() * 1000, Math.random() * 1000, 5 + Math.random() * 10, 3 + Math.random() * 5);

  // motherboard
  const board = new THREE.Group();
  board.add(box(3, 3.2, 0.06, mat(0xffffff, { map: new THREE.CanvasTexture(bc), metalness: 0.25, roughness: 0.6 })));
  board.add(box(0.64, 0.64, 0.05, M.dark(), 0.2, 0.7, 0.06));
  board.add(box(2.4, 0.1, 0.1, M.black(), -0.1, -0.5, 0.07));
  board.add(box(1.0, 0.34, 0.16, M.alu(), -0.9, 1.35, 0.1));
  board.add(box(1.25, 0.26, 0.12, M.alu(), 0.4, 1.3, 0.09));
  board.add(box(0.7, 0.6, 0.12, M.alu(), 0.5, -1.1, 0.08));
  for (let i = 0; i < 4; i++) board.add(box(0.07, 1.25, 0.06, M.black(), 1.0 + i * 0.13, 0.75, 0.07));

  // CPU
  const cpu = new THREE.Group();
  cpu.add(box(0.5, 0.5, 0.04, M.steel(), 0.2, 0.7, 0.11));
  cpu.add(box(0.34, 0.34, 0.02, mat(0xc9ced6, { metalness: 0.9, roughness: 0.25 }), 0.2, 0.7, 0.14));

  // RAM
  const ram: THREE.Group[] = [];
  for (let i = 0; i < 4; i++) {
    const r = new THREE.Group();
    r.add(box(0.07, 1.25, 0.3, M.dark(), 1.0 + i * 0.13, 0.75, 0.21));
    r.add(box(0.078, 1.2, 0.03, rgbM(), 1.0 + i * 0.13, 0.75, 0.375));
    ram.push(r);
  }

  // SSD
  const ssd = new THREE.Group();
  ssd.add(box(0.7, 0.22, 0.03, M.alu(), -0.6, 0.1, 0.1));
  ssd.add(box(0.66, 0.18, 0.012, M.steel(), -0.6, 0.1, 0.122));
  ssd.add(new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.03, 12).rotateX(Math.PI / 2), M.steel()).translateX(-0.28).translateY(0.1).translateZ(0.13));

  // GPU
  const gpu = new THREE.Group();
  gpu.add(box(2.7, 0.55, 0.6, M.dark()));
  gpu.add(box(2.72, 0.04, 0.62, rgbM(), 0, 0.29, 0));
  gpu.add(box(2.7, 0.5, 0.02, M.alu(), 0, 0, -0.31));
  [-0.85, 0, 0.85].forEach((x) => {
    const f = fan(0.2);
    f.position.set(x, 0, 0.31);
    gpu.add(f);
  });
  gpu.position.set(0, -0.5, 0.38);

  // PSU
  const psu = new THREE.Group();
  psu.add(box(3.0, 0.7, 0.95, M.dark(), 0, -2.35, 0.35));
  const pf = fan(0.26);
  pf.position.set(0.8, -2.35, 0.84);
  psu.add(pf);
  psu.add(box(1.4, 0.05, 0.01, rgbM(), -0.7, -2.35, 0.84));

  // liquid cooling
  const pump = new THREE.Group();
  pump.add(new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.16, 32).rotateX(Math.PI / 2), M.alu()).translateX(0.2).translateY(0.7).translateZ(0.24));
  const cap = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.02, 8, 40), rgbM());
  cap.position.set(0.2, 0.7, 0.33);
  pump.add(cap);
  const rad = new THREE.Group();
  rad.add(box(1.9, 0.34, 0.14, M.dark(), -0.15, 1.78, 0.42));

  const tubeMat = () => mat(0x0d0f12, { metalness: 0.2, roughness: 0.7 });
  function tube(pts: number[][], r: number, m: THREE.Material) {
    const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(p[0], p[1], p[2]))), 56, r, 8, false);
    const mesh = new THREE.Mesh(geo, m);
    mesh.userData.count = geo.index!.count;
    return mesh;
  }
  const tubes = [
    tube([[0.45, 0.9, 0.3], [0.8, 1.15, 0.52], [0.85, 1.5, 0.5], [0.7, 1.72, 0.42]], 0.045, tubeMat()),
    tube([[0.05, 0.9, 0.3], [-0.2, 1.2, 0.52], [-0.6, 1.45, 0.5], [-0.95, 1.72, 0.42]], 0.045, tubeMat()),
  ];

  // case fans
  const caseFans: THREE.Group[] = [];
  [-0.65, -0.15, 0.35].forEach((x) => {
    const f = fan(0.17);
    f.position.set(x, 1.78, 0.52);
    caseFans.push(f);
  });
  [0.9, 0.35].forEach((y) => {
    const f = fan(0.21);
    f.position.set(-1.25, y, 0.26);
    caseFans.push(f);
  });

  // cables
  const cables = [
    tube([[1.3, -2.0, 0.75], [1.52, -1.4, 0.6], [1.47, -0.6, 0.28], [1.44, -0.1, 0.13]], 0.04, mat(0x1c7a4a, { metalness: 0.1, roughness: 0.8 })),
    tube([[0.8, -2.0, 0.8], [1.1, -1.3, 0.9], [1.25, -0.95, 0.82], [1.2, -0.6, 0.74]], 0.04, tubeMat()),
    tube([[-1.0, -2.0, 0.5], [-1.56, -1.0, 0.36], [-1.56, 0.3, 0.34], [-1.2, 1.3, 0.3], [-0.95, 1.4, 0.22]], 0.04, tubeMat()),
  ];

  // case
  const cas = new THREE.Group();
  const frame = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(3.5, 4.9, 1.5)),
    new THREE.LineBasicMaterial({ color: GREEN, transparent: true, opacity: 0.55 }),
  );
  frame.position.set(0, -0.35, 0.45);
  cas.add(frame);
  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(3.5, 4.9),
    new THREE.MeshStandardMaterial({ color: 0x9fc3d8, transparent: true, opacity: 0.1, roughness: 0.05, metalness: 0, depthWrite: false, side: THREE.DoubleSide }),
  );
  glass.position.set(0, -0.35, 1.2);
  glass.renderOrder = 10;
  cas.add(glass);
  cas.add(box(3.5, 4.9, 0.04, mat(0x0b0d11, { metalness: 0.2, roughness: 0.8 }), 0, -0.35, -0.3));
  cas.add(box(3.5, 0.1, 1.5, M.dark(), 0, -2.8, 0.45));
  [-1.6, 1.6].forEach((x) => cas.add(box(0.2, 0.12, 0.5, M.black(), x, -2.9, 0.45)));

  const parts: PcParts = { board, cpu, ram, ssd, gpu, psu, pump, rad, tubes, fans: caseFans, cables, case: cas };
  const all: THREE.Object3D[] = [board, cpu, ...ram, ssd, gpu, psu, pump, rad, ...tubes, ...caseFans, ...cables, cas];
  all.forEach((o) => group.add(o));
  all.forEach((o) => setOpacity(o, 0)); // start invisible

  const hue = new THREE.Color();
  return {
    group,
    parts,
    rgb,
    setOp: setOpacity,
    update(t, dt) {
      const power = Math.min(1, rgb.v * 1.2);
      fans.forEach((f, i) => {
        f.rotation.z -= dt * (1 + power * 9) * (i % 2 ? 1 : 1.15);
      });
      rgbMats.forEach((m, i) => {
        hue.setHSL(0.36 + 0.07 * Math.sin(t * 0.45 + i * 0.55), 0.78, 0.52);
        m.emissive.copy(hue);
        m.emissiveIntensity = rgb.v * 1.9;
      });
    },
  };
}

const STAGE: StageConfig = {
  exposure: 1.15,
  ambient: 0.6,
  key: { intensity: 1.15, pos: [5, 7, 8] },
  rim: { pos: [-6, 2, -3] },
  fill: { pos: [6, -1, 6] },
  inner: { pos: [0, -0.3, 1.2], distance: 8, gain: 1.8 },
  floor: { y: -2.9, size: 18, divisions: 36, glow: 0.42 },
  beam: { radius: 3.6, height: 9, pos: [0, 2.4, 0.3], opacity: 0.045 },
  dust: { count: 180, spread: 14, yScale: 9, yMin: -3, size: 0.035 },
  camera: {
    ang: 0.7,
    h: 1.1,
    lookAtOffset: [0, -0.45, 0.4],
    parallaxY: 0.9,
    spin: 0.09,
    distance: (asp) => Math.max(11, 4.6 / (0.65 * asp)),
    shift: { wide: 0.17, narrow: 0.15 },
  },
};

export const scene: SceneDefinition<PcModel> = {
  create: (canvas) => createStage(canvas, buildPC, STAGE),

  timeline({ tl, S, mark, enter, draw, cam }) {
    const P = S.model.parts;
    tl.to(S.lv, { v: 1, duration: 1.8, ease: 'power2.out' }, 0);
    cam(0, { ang: 0.3 }, 17, 'none');
    mark(0, 0);
    mark(1, 1.4);
    enter(P.board, { z: -2.5, ry: 0.9, y: 0.4 }, 1.4, 1.8, 'power3.out');
    mark(2, 3.5);
    enter(P.cpu, { z: 3, y: 0.4 }, 3.5, 1.3, 'power3.inOut');
    mark(3, 5.2);
    P.ram.forEach((r, i) => enter(r, { y: 2.4 }, 5.2 + i * 0.18, 1.1, 'power3.inOut'));
    mark(4, 6.9);
    enter(P.ssd, { z: 1.6, x: -0.8, rz: 0.5 }, 6.9, 1.1, 'power3.out');
    mark(5, 8.2);
    enter(P.gpu, { x: 4.6 }, 8.2, 1.7, 'power3.inOut');
    mark(6, 10.1);
    enter(P.psu, { y: -3.4 }, 10.1, 1.3, 'power3.out');
    mark(7, 11.6);
    enter(P.pump, { z: 2.4 }, 11.6, 1.1, 'power3.inOut');
    enter(P.rad, { y: 2.6 }, 12, 1.1, 'power3.out');
    P.tubes.forEach((t, i) => draw(t, 12.9 + i * 0.15, 0.9));
    mark(8, 13.9);
    P.fans.forEach((f, i) => enter(f, { z: 1.4 }, 13.9 + i * 0.12, 0.8, 'power3.out'));
    P.cables.forEach((c, i) => draw(c, 14.8 + i * 0.3, 1.2));
    mark(9, 16.7);
    enter(P.case, { z: 1.2 }, 16.7, 1.6, 'power2.out');
    cam(16.7, { h: 1.5 }, 2, 'power1.inOut');
    mark(10, 18.4);
    tl.to(S.model.rgb, { v: 1, duration: 1.8, ease: 'power2.inOut' }, 18.4);
    mark(11, 20);
    cam(20, { ang: 0.3 + Math.PI * 2, h: 1.2 }, 5.5, 'power2.inOut');
    return { doneAt: 21.3, timeScale: 1.15 };
  },
};
