import * as THREE from 'three';

export interface EngineScene {
  readonly name: string;
  readonly root: THREE.Scene;
  onEnter?(): void | Promise<void>;
  onExit?(): void | Promise<void>;
  update?(deltaSeconds: number): void;
}

/** Handles scene transitions and ensures only one game scene is active at a time. */
export class SceneManager {
  private active?: EngineScene;
  private transitioning = false;

  get current(): EngineScene | undefined { return this.active; }

  async load(next: EngineScene): Promise<void> {
    if (this.transitioning) throw new Error('A scene transition is already running');
    if (this.active === next) return;
    this.transitioning = true;
    try {
      await this.active?.onExit?.();
      this.active = next;
      await next.onEnter?.();
    } catch (error) {
      this.active = undefined;
      throw error;
    } finally {
      this.transitioning = false;
    }
  }

  update(deltaSeconds: number): void {
    this.active?.update?.(deltaSeconds);
  }
}
