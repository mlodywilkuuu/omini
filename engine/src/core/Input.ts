export type InputAction = 'pressed' | 'released';

/** Centralized keyboard and pointer input. Call dispose() when the owning scene is unloaded. */
export class Input {
  private readonly held = new Set<string>();
  private readonly pressed = new Set<string>();
  private readonly released = new Set<string>();
  private readonly onDown = (event: KeyboardEvent) => {
    if (!this.held.has(event.code)) this.pressed.add(event.code);
    this.held.add(event.code);
  };
  private readonly onUp = (event: KeyboardEvent) => {
    this.held.delete(event.code);
    this.released.add(event.code);
  };
  private readonly onBlur = () => {
    for (const key of this.held) this.released.add(key);
    this.held.clear();
  };

  constructor(private readonly target: Window = window) {
    target.addEventListener('keydown', this.onDown);
    target.addEventListener('keyup', this.onUp);
    target.addEventListener('blur', this.onBlur);
  }

  isDown(code: string): boolean { return this.held.has(code); }
  wasPressed(code: string): boolean { return this.pressed.has(code); }
  wasReleased(code: string): boolean { return this.released.has(code); }

  /** Clear one-frame transitions at the end of each simulation tick. */
  endFrame(): void { this.pressed.clear(); this.released.clear(); }

  dispose(): void {
    this.target.removeEventListener('keydown', this.onDown);
    this.target.removeEventListener('keyup', this.onUp);
    this.target.removeEventListener('blur', this.onBlur);
    this.held.clear();
    this.endFrame();
  }
}
