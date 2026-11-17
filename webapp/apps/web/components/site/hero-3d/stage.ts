/**
 * Generic three.js "stage" for the 3D hero intros (PC build on /montagem-de-pc,
 * phone repair on /reparos): lights, glowing floor, light beam, dust, camera rig
 * and the per-frame update. Each page supplies its own model and look through a
 * StageConfig; the playback timeline lives in the scene modules (pcScene/phoneScene).
 */
import * as THREE from 'three';

/** Brand green (--aki-green-500) as a three.js hex, and as "r,g,b" for canvas gradients. */
export const GREEN = 0x2fd35c;
export const GREEN_RGB = '47,211,92';

export type Vec3 = readonly [number, number, number];

export interface StageModel {
  group: THREE.Group;
  /** 0..1 glow of the RGB parts; also drives the inner point light */
  rgb: { v: number };
  setOp: (obj: THREE.Object3D, v: number) => void;
  update: (t: number, dt: number) => void;
}

/** Orbit rig: angle / height / distance multiplier around the target (lx, ly, lz). */
export interface CameraState {
  ang: number;
  h: number;
  r: number;
  lx: number;
  ly: number;
  lz: number;
}

export interface StageConfig {
  exposure: number;
  ambient: number;
  key: { intensity: number; pos: Vec3 };
  rim: { pos: Vec3 };
  fill: { pos: Vec3 };
  inner: { pos: Vec3; distance: number; gain: number };
  floor: { y: number; size: number; divisions: number; glow: number };
  beam: { radius: number; height: number; pos: Vec3; opacity: number };
  dust: { count: number; spread: number; yScale: number; yMin: number; size: number };
  camera: {
    ang: number;
    h: number;
    /** the camera looks at (target + lookAtOffset) */
    lookAtOffset: Vec3;
    /** vertical pointer parallax */
    parallaxY: number;
    /** idle orbit speed (rad/s) once the intro finished */
    spin: number;
    /** orbit distance for a given viewport aspect ratio */
    distance: (aspect: number) => number;
    /** how far the model is pushed off-centre (fraction of the viewport): sideways on wide screens, upwards on tall ones */
    shift: { wide: number; narrow: number };
  };
}

export interface Stage<M extends StageModel = StageModel> {
  model: M;
  /** light level 0..1 (rim / fill / beam / floor) */
  lv: { v: number };
  cs: CameraState;
  visible: boolean;
  /** slow idle orbit once the intro finished */
  idleOn: boolean;
  spin: boolean;
  frame: (dt: number) => void;
  dispose: () => void;
}

/** Scales every material's original opacity by v (and hides the object near 0). */
export function setOpacity(obj: THREE.Object3D, v: number) {
  obj.traverse((c) => {
    const mesh = c as THREE.Mesh;
    if (!mesh.material) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mats.forEach((m) => {
      if (m.userData.b === undefined) m.userData.b = m.opacity;
      m.opacity = (m.userData.b as number) * v;
      m.visible = v > 0.01;
    });
    c.visible = v > 0.01 || (c as THREE.Group).isGroup;
  });
}

/** `build` runs after the WebGL context exists, so a missing WebGL fails fast (before modelling anything). */
export function createStage<M extends StageModel>(canvas: HTMLCanvasElement, build: () => M, cfg: StageConfig): Stage<M> {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = cfg.exposure;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  scene.add(new THREE.AmbientLight(0x8da0b4, cfg.ambient));
  const key = new THREE.DirectionalLight(0xffffff, cfg.key.intensity);
  key.position.set(...cfg.key.pos);
  scene.add(key);
  const rim = new THREE.PointLight(GREEN, 0, 22);
  rim.position.set(...cfg.rim.pos);
  scene.add(rim);
  const fill = new THREE.PointLight(0x6fa8ff, 0.7, 26);
  fill.position.set(...cfg.fill.pos);
  scene.add(fill);
  const inner = new THREE.PointLight(GREEN, 0, cfg.inner.distance);
  inner.position.set(...cfg.inner.pos);
  scene.add(inner);

  // glowing floor + faint grid
  const fc = document.createElement('canvas');
  fc.width = fc.height = 512;
  const fx = fc.getContext('2d')!;
  const gr = fx.createRadialGradient(256, 256, 10, 256, 256, 256);
  gr.addColorStop(0, `rgba(${GREEN_RGB},${cfg.floor.glow})`);
  gr.addColorStop(0.35, `rgba(${GREEN_RGB},.1)`);
  gr.addColorStop(1, `rgba(${GREEN_RGB},0)`);
  fx.fillStyle = gr;
  fx.fillRect(0, 0, 512, 512);
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(cfg.floor.size, cfg.floor.size).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(fc), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  floor.position.y = cfg.floor.y;
  scene.add(floor);
  const grid = new THREE.GridHelper(cfg.floor.size, cfg.floor.divisions, GREEN, GREEN);
  const gridMat = grid.material as THREE.LineBasicMaterial;
  gridMat.transparent = true;
  gridMat.opacity = 0.07;
  grid.position.y = cfg.floor.y + 0.01;
  scene.add(grid);

  // volumetric light beam
  const beam = new THREE.Mesh(
    new THREE.ConeGeometry(cfg.beam.radius, cfg.beam.height, 32, 1, true),
    new THREE.MeshBasicMaterial({ color: GREEN, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
  );
  beam.position.set(...cfg.beam.pos);
  scene.add(beam);

  // dust particles
  const { count, spread, yScale, yMin, size } = cfg.dust;
  const pp = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pp[i * 3] = (Math.random() - 0.5) * spread;
    pp[i * 3 + 1] = Math.random() * yScale + yMin;
    pp[i * 3 + 2] = (Math.random() - 0.5) * spread;
  }
  const dg = new THREE.BufferGeometry();
  dg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
  const dust = new THREE.Points(
    dg,
    new THREE.PointsMaterial({ size, color: 0xb6f5c8, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  scene.add(dust);

  const model = build();
  scene.add(model.group);

  const cam = cfg.camera;
  let R = 11;
  let px = 0;
  let py = 0;
  let tpx = 0;
  let tpy = 0;
  let t = 0;
  const S: Stage<M> = {
    model,
    lv: { v: 0 },
    cs: { ang: cam.ang, h: cam.h, r: 1, lx: 0, ly: 0, lz: 0 },
    visible: false,
    idleOn: false,
    spin: true,
    frame(dt) {
      t += dt;
      const c = S.cs;
      if (S.spin && S.idleOn) c.ang += dt * cam.spin;
      px += (tpx - px) * 0.04;
      py += (tpy - py) * 0.04;
      const a = c.ang + px * 0.25;
      const rad = R * c.r;
      camera.position.set(c.lx + Math.sin(a) * rad, c.ly + c.h + py * -cam.parallaxY, c.lz + Math.cos(a) * rad);
      camera.lookAt(c.lx + cam.lookAtOffset[0], c.ly + cam.lookAtOffset[1], c.lz + cam.lookAtOffset[2]);
      rim.intensity = S.lv.v * 1.6;
      fill.intensity = 0.7 * S.lv.v + 0.15;
      beam.material.opacity = S.lv.v * cfg.beam.opacity;
      inner.intensity = model.rgb.v * cfg.inner.gain;
      floor.material.opacity = 0.25 + S.lv.v * 0.75;
      dust.rotation.y += dt * 0.01;
      model.update(t, dt);
      renderer.render(scene, camera);
    },
    dispose() {
      ro.disconnect();
      window.removeEventListener('pointermove', onPointer);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        const mats = m.material ? (Array.isArray(m.material) ? m.material : [m.material]) : [];
        mats.forEach((mm) => {
          (mm as THREE.MeshStandardMaterial).map?.dispose();
          mm.dispose();
        });
      });
      renderer.dispose();
    },
  };

  function resize() {
    const p = canvas.parentElement!;
    const w = p.clientWidth;
    const h = p.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    const asp = w / h;
    camera.aspect = asp;
    R = cam.distance(asp);
    if (asp > 1.3) camera.setViewOffset(w, h, -w * cam.shift.wide, 0, w, h);
    else camera.setViewOffset(w, h, 0, h * cam.shift.narrow, w, h);
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement!);
  resize();

  const onPointer = (e: PointerEvent) => {
    tpx = e.clientX / window.innerWidth - 0.5;
    tpy = e.clientY / window.innerHeight - 0.5;
  };
  if (!window.matchMedia('(hover:none)').matches) window.addEventListener('pointermove', onPointer, { passive: true });

  return S;
}
