/** Timeline building blocks shared by the hero scenes (pcScene, phoneScene). */
import type { Mesh, Object3D } from 'three';
import type { CameraState, Stage, StageModel } from './stage';

export interface EnterOffset {
  x?: number;
  y?: number;
  z?: number;
  rx?: number;
  ry?: number;
  rz?: number;
}

export interface TimelineApi {
  /** switches the HUD to step `i` at time `at` */
  mark: (i: number, at: number) => void;
  /** slides/rotates `obj` in from an offset while fading it in */
  enter: (obj: Object3D, from: EnterOffset, at: number, dur: number, ease?: string) => void;
  /** progressively draws a tube mesh (its geometry needs userData.count = index count) */
  draw: (mesh: Mesh, at: number, dur: number) => void;
  /** tweens the camera rig */
  cam: (at: number, to: Partial<CameraState>, dur?: number, ease?: string) => void;
}

export interface SceneContext<M extends StageModel = StageModel> extends TimelineApi {
  tl: gsap.core.Timeline;
  S: Stage<M>;
}

export interface SceneDefinition<M extends StageModel = StageModel> {
  create(canvas: HTMLCanvasElement): Stage<M>;
  /**
   * Adds the intro tweens to the (paused) timeline. Returns when the final headline
   * should appear (seconds on the timeline) and the playback speed.
   */
  timeline(ctx: SceneContext<M>): { doneAt: number; timeScale: number };
}

export function createTimelineApi(
  tl: gsap.core.Timeline,
  setOp: (obj: Object3D, v: number) => void,
  cs: CameraState,
  setStep: (i: number) => void,
): TimelineApi {
  return {
    mark(i, at) {
      tl.call(() => setStep(i), undefined, at);
    },
    enter(obj, from, at, dur, ease = 'power3.out') {
      const f = { x: obj.position.x, y: obj.position.y, z: obj.position.z, rx: obj.rotation.x, ry: obj.rotation.y, rz: obj.rotation.z };
      obj.position.set(f.x + (from.x || 0), f.y + (from.y || 0), f.z + (from.z || 0));
      obj.rotation.set(f.rx + (from.rx || 0), f.ry + (from.ry || 0), f.rz + (from.rz || 0));
      tl.to(obj.position, { x: f.x, y: f.y, z: f.z, duration: dur, ease }, at);
      tl.to(obj.rotation, { x: f.rx, y: f.ry, z: f.rz, duration: dur, ease }, at);
      const o = { v: 0 };
      tl.to(o, { v: 1, duration: dur * 0.55, ease: 'none', onUpdate: () => setOp(obj, o.v) }, at);
    },
    draw(mesh, at, dur) {
      const o = { v: 0 };
      mesh.geometry.setDrawRange(0, 0);
      tl.to(
        o,
        {
          v: 1,
          duration: dur,
          ease: 'power1.inOut',
          onUpdate: () => {
            mesh.geometry.setDrawRange(0, Math.floor((o.v * (mesh.userData.count as number)) / 3) * 3);
            setOp(mesh, o.v > 0 ? 1 : 0);
          },
        },
        at,
      );
    },
    cam(at, to, dur = 1.2, ease = 'power2.inOut') {
      tl.to(cs, { ...to, duration: dur, ease }, at);
    },
  };
}
