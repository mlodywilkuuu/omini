import * as THREE from 'three';

type TerrainTool = 'raise' | 'lower' | 'smooth' | 'flatten';

export interface TerrainEditorOptions {
  size?: number;
  segments?: number;
  initialRelief?: boolean;
}

/** Vertex-based terrain sculpting with deterministic heightmap export. */
export class TerrainEditor {
  readonly mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>;
  private readonly geometry: THREE.PlaneGeometry;
  private readonly heights: Float32Array;
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();
  private readonly panel: HTMLElement;
  private readonly size: number;
  private readonly segments: number;
  private tool: TerrainTool = 'raise';
  private radius = 5;
  private strength = 2;
  private flattenHeight = 0;
  private sculpting = false;
  private enabled = false;
  private readonly onPointerDown = (event: PointerEvent) => this.pointerDown(event);
  private readonly onPointerMove = (event: PointerEvent) => this.pointerMove(event);
  private readonly onPointerUp = () => { this.sculpting = false; };

  constructor(
    private readonly host: HTMLElement,
    private readonly scene: THREE.Scene,
    private readonly camera: THREE.Camera,
    private readonly renderer: THREE.WebGLRenderer,
    options: TerrainEditorOptions = {}
  ) {
    this.size = options.size ?? 180;
    this.segments = options.segments ?? 128;
    this.geometry = new THREE.PlaneGeometry(this.size, this.size, this.segments, this.segments);
    this.heights = new Float32Array((this.segments + 1) * (this.segments + 1));
    if (options.initialRelief !== false) {
      for (let y = 0; y <= this.segments; y++) for (let x = 0; x <= this.segments; x++) {
        const wx = (x / this.segments - 0.5) * this.size;
        const wz = (y / this.segments - 0.5) * this.size;
        const broad = Math.sin(wx * 0.047) * Math.cos(wz * 0.039) * 1.15;
        const ridge = Math.sin((wx + wz) * 0.085) * 0.34;
        const basin = Math.exp(-(wx * wx + wz * wz) / 520) * 1.3;
        this.heights[y * (this.segments + 1) + x] = broad + ridge + basin;
      }
    }
    const positions = this.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < positions.count; i++) positions.setZ(i, this.heights[i]);
    this.geometry.computeVertexNormals();
    this.geometry.computeBoundingSphere();
    const material = new THREE.MeshStandardMaterial({
      color: 0x718b5c, roughness: 0.94, metalness: 0,
      flatShading: false
    });
    this.mesh = new THREE.Mesh(this.geometry, material);
    this.mesh.name = 'OUTLANDS Terrain';
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;
    this.mesh.userData.terrain = true;
    scene.add(this.mesh);

    this.panel = document.createElement('aside');
    this.panel.className = 'terrain-editor';
    this.panel.innerHTML = `
      <header><div><b>TERRAIN LAB</b><small>OUTLANDS · LANDSCAPE TOOLS</small></div><button data-action="close" aria-label="Zamknij">×</button></header>
      <div class="terrain-tools">
        <button data-tool="raise" class="active">＋ PODNIEŚ</button>
        <button data-tool="lower">－ OBNIŻ</button>
        <button data-tool="smooth">≈ WYGŁADŹ</button>
        <button data-tool="flatten">▰ SPŁASZCZ</button>
      </div>
      <label>ROZMIAR PĘDZLA <output data-value="radius">5.0</output><input data-setting="radius" type="range" min="1" max="18" step=".5" value="5"></label>
      <label>SIŁA PĘDZLA <output data-value="strength">2.0</output><input data-setting="strength" type="range" min=".1" max="8" step=".1" value="2"></label>
      <div class="terrain-actions"><button data-action="reset">RESETUJ RZEŹBĘ</button><button data-action="export">EKSPORT HEIGHTMAP</button></div>
      <p>Przytrzymaj LPM na terenie, aby rzeźbić. F2 zamyka panel.</p>`;
    host.appendChild(this.panel);
    this.panel.addEventListener('click', event => {
      const target = (event.target as HTMLElement).closest<HTMLButtonElement>('button');
      if (!target) return;
      if (target.dataset.tool) {
        this.tool = target.dataset.tool as TerrainTool;
        this.panel.querySelectorAll('[data-tool]').forEach(button => button.classList.toggle('active', button === target));
      }
      if (target.dataset.action === 'close') this.setEnabled(false);
      if (target.dataset.action === 'reset') this.reset();
      if (target.dataset.action === 'export') this.exportHeightmap();
    });
    this.panel.addEventListener('input', event => {
      const input = event.target as HTMLInputElement;
      const key = input.dataset.setting;
      if (key === 'radius') this.radius = Number(input.value);
      if (key === 'strength') this.strength = Number(input.value);
      if (key) this.panel.querySelector(`[data-value="${key}"]`)!.textContent = Number(input.value).toFixed(1);
    });
    renderer.domElement.addEventListener('pointerdown', this.onPointerDown);
    renderer.domElement.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
  }

  get isEnabled(): boolean { return this.enabled; }

  setEnabled(value: boolean): void {
    this.enabled = value;
    this.panel.classList.toggle('is-open', value);
    this.renderer.domElement.style.cursor = value ? 'crosshair' : 'default';
    if (value && document.pointerLockElement) document.exitPointerLock();
    this.sculpting = false;
  }

  toggle(): void { this.setEnabled(!this.enabled); }

  private hit(event: PointerEvent): THREE.Vector3 | undefined {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const result = this.raycaster.intersectObject(this.mesh, false)[0];
    return result?.point ? this.mesh.worldToLocal(result.point.clone()) : undefined;
  }

  private pointerDown(event: PointerEvent): void {
    if (!this.enabled || event.button !== 0 || (event.target as HTMLElement).closest('.terrain-editor')) return;
    this.sculpting = true;
    this.applyBrush(this.hit(event));
  }

  private pointerMove(event: PointerEvent): void {
    if (!this.enabled || !this.sculpting) return;
    this.applyBrush(this.hit(event));
  }

  private applyBrush(point?: THREE.Vector3): void {
    if (!point) return;
    const positions = this.geometry.attributes.position as THREE.BufferAttribute;
    const target = this.tool === 'flatten' ? this.flattenHeight : point.z;
    const before = this.heights.slice();
    const stepX = this.size / this.segments;
    for (let i = 0; i < positions.count; i++) {
      const dx = positions.getX(i) - point.x;
      const dy = positions.getY(i) - point.y;
      const distance = Math.hypot(dx, dy);
      if (distance > this.radius) continue;
      const falloff = Math.pow(1 - distance / this.radius, 2);
      const index = i;
      if (this.tool === 'raise') this.heights[index] += this.strength * 0.018 * falloff;
      else if (this.tool === 'lower') this.heights[index] -= this.strength * 0.018 * falloff;
      else if (this.tool === 'flatten') this.heights[index] = THREE.MathUtils.lerp(this.heights[index], target, Math.min(1, this.strength * 0.012 * falloff));
      else {
        const x = Math.round((positions.getX(i) + this.size / 2) / stepX);
        const y = Math.round((positions.getY(i) + this.size / 2) / stepX);
        let sum = 0, count = 0;
        for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) {
          const nx = x + ox, ny = y + oy;
          if (nx < 0 || ny < 0 || nx > this.segments || ny > this.segments) continue;
          sum += before[ny * (this.segments + 1) + nx]; count++;
        }
        this.heights[index] = THREE.MathUtils.lerp(before[index], sum / count, Math.min(1, this.strength * 0.018 * falloff));
      }
      positions.setZ(i, this.heights[index]);
    }
    positions.needsUpdate = true;
    this.geometry.computeVertexNormals();
    this.geometry.computeBoundingSphere();
    if (this.tool === 'flatten') this.flattenHeight = target;
  }

  private reset(): void {
    const positions = this.geometry.attributes.position as THREE.BufferAttribute;
    this.heights.fill(0);
    for (let i = 0; i < positions.count; i++) positions.setZ(i, 0);
    positions.needsUpdate = true;
    this.geometry.computeVertexNormals();
    this.geometry.computeBoundingSphere();
  }

  private exportHeightmap(): void {
    const payload = {
      format: 'outlands-heightmap', version: 1, width: this.segments + 1, height: this.segments + 1,
      worldSize: this.size, heights: Array.from(this.heights)
    };
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = 'outlands-heightmap.json'; anchor.click();
    URL.revokeObjectURL(url);
  }

  dispose(): void {
    this.setEnabled(false);
    this.renderer.domElement.removeEventListener('pointerdown', this.onPointerDown);
    this.renderer.domElement.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    this.panel.remove();
    this.geometry.dispose();
    this.mesh.material.dispose();
    this.scene.remove(this.mesh);
  }
}
