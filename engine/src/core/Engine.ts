import * as THREE from 'three';

export type EngineFrame = (deltaSeconds: number, elapsedSeconds: number) => void;
export interface EngineOptions {
  canvasHost: HTMLElement;
  scene?: THREE.Scene;
  camera?: THREE.Camera;
  maxPixelRatio?: number;
  shadows?: boolean;
}

export class Engine {
  readonly scene: THREE.Scene;
  readonly renderer: THREE.WebGLRenderer;
  camera: THREE.Camera;
  private readonly clock = new THREE.Clock();
  private readonly callbacks = new Set<EngineFrame>();
  private raf = 0;
  private running = false;
  private previousFrame = 0;
  private frameCount = 0;
  private fpsWindow = 0;
  private currentFps = 0;
  private readonly resizeObserver: ResizeObserver;

  constructor(options: EngineOptions) {
    this.scene = options.scene ?? new THREE.Scene();
    this.camera = options.camera ?? new THREE.PerspectiveCamera(70, 1, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      logarithmicDepthBuffer: false
    });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, options.maxPixelRatio ?? 2));
    this.renderer.shadowMap.enabled = options.shadows ?? true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;
    this.renderer.info.autoReset = true;
    options.canvasHost.appendChild(this.renderer.domElement);
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(options.canvasHost);
    this.resize();
  }

  get fps(): number { return this.currentFps; }
  get frameTimeMs(): number { return this.previousFrame; }
  get isRunning(): boolean { return this.running; }

  onFrame(callback: EngineFrame): () => void {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.clock.start();
    const frame = () => {
      if (!this.running) return;
      this.raf = requestAnimationFrame(frame);
      const start = performance.now();
      const dt = Math.min(this.clock.getDelta(), 0.05);
      for (const callback of this.callbacks) callback(dt, this.clock.elapsedTime);
      this.renderer.render(this.scene, this.camera);
      this.previousFrame = performance.now() - start;
      this.frameCount++;
      this.fpsWindow += dt;
      if (this.fpsWindow >= 0.5) {
        this.currentFps = Math.round(this.frameCount / this.fpsWindow);
        this.frameCount = 0;
        this.fpsWindow = 0;
      }
    };
    this.raf = requestAnimationFrame(frame);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.clock.stop();
  }

  resize(): void {
    const host = this.renderer.domElement.parentElement;
    if (!host) return;
    const width = Math.max(1, host.clientWidth);
    const height = Math.max(1, host.clientHeight);
    if (this.camera instanceof THREE.PerspectiveCamera) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
    this.renderer.setSize(width, height, false);
  }

  setPixelRatioCap(maxPixelRatio: number): void {
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, Math.max(1, maxPixelRatio)));
    this.resize();
  }

  dispose(): void {
    this.stop();
    this.resizeObserver.disconnect();
    this.callbacks.clear();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
