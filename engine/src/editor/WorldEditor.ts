import * as THREE from 'three';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

type Editable = THREE.Object3D & { userData: { [key: string]: unknown } };

export class WorldEditor {
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();
  private readonly gizmo: TransformControls;
  private readonly orbit: OrbitControls;
  private readonly panel: HTMLElement;
  private readonly hierarchy: HTMLElement;
  private readonly details: HTMLElement;
  private selected?: THREE.Object3D;
  private enabled = false;
  private readonly onCanvasClick = (event: MouseEvent) => this.pick(event);
  private readonly onKey = (event: KeyboardEvent) => {
    if (!this.enabled || event.target instanceof HTMLInputElement) return;
    if (event.code === 'KeyQ') this.gizmo.setMode('translate');
    if (event.code === 'KeyW') this.gizmo.setMode('rotate');
    if (event.code === 'KeyE') this.gizmo.setMode('scale');
    if (event.code === 'Delete' || event.code === 'Backspace') this.removeSelected();
  };

  constructor(
    private readonly host: HTMLElement,
    private readonly scene: THREE.Scene,
    private readonly camera: THREE.Camera,
    private readonly renderer: THREE.WebGLRenderer
  ) {
    this.orbit = new OrbitControls(camera, renderer.domElement);
    this.orbit.enableDamping = true;
    this.orbit.enabled = false;
    this.gizmo = new TransformControls(camera, renderer.domElement);
    this.gizmo.addEventListener('dragging-changed', event => {
      renderer.domElement.style.cursor = event.value ? 'grabbing' : 'crosshair';
      this.orbit.enabled = this.enabled && !event.value;
    });
    this.gizmo.addEventListener('objectChange', () => this.refreshDetails());
    scene.add(this.gizmo.getHelper());

    this.panel = document.createElement('section');
    this.panel.className = 'world-editor';
    this.panel.innerHTML = `
      <header class="editor-header"><div><b>OUTLANDS</b><small>WORLD EDITOR · PREVIEW</small></div><button data-action="close" title="Zamknij edytor">×</button></header>
      <div class="editor-toolbar">
        <button data-action="cube">+ KOSTKA</button><button data-action="sphere">+ KULA</button><button data-action="light">+ ŚWIATŁO</button>
      </div>
      <div class="editor-columns">
        <section class="editor-section"><h3>HIERARCHIA</h3><div class="editor-hierarchy"></div></section>
        <section class="editor-section"><h3>INSPEKTOR</h3><div class="editor-details"><p>Wybierz obiekt w scenie.</p></div></section>
      </div>
      <footer><span>Q PRZESUŃ · W OBRÓĆ · E SKALUJ · DELETE USUŃ</span><button data-action="save">EKSPORTUJ SCENĘ</button></footer>`;
    host.appendChild(this.panel);
    this.hierarchy = this.panel.querySelector('.editor-hierarchy')!;
    this.details = this.panel.querySelector('.editor-details')!;
    this.panel.addEventListener('click', event => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-action]');
      if (!button) return;
      const action = button.dataset.action;
      if (action === 'close') this.setEnabled(false);
      if (action === 'cube') this.addPrimitive('cube');
      if (action === 'sphere') this.addPrimitive('sphere');
      if (action === 'light') this.addLight();
      if (action === 'save') this.exportScene();
    });
    renderer.domElement.addEventListener('click', this.onCanvasClick);
    window.addEventListener('keydown', this.onKey);
    this.refreshHierarchy();
  }

  get isEnabled(): boolean { return this.enabled; }

  setEnabled(value: boolean): void {
    this.enabled = value;
    this.panel.classList.toggle('is-open', value);
    this.gizmo.enabled = value;
    this.orbit.enabled = value;
    if (!value) {
      this.gizmo.detach();
      this.selected = undefined;
      this.refreshDetails();
      if (document.pointerLockElement === this.renderer.domElement) document.exitPointerLock();
    }
    this.renderer.domElement.style.cursor = value ? 'crosshair' : 'default';
  }

  toggle(): void { this.setEnabled(!this.enabled); }

  update(): void { if (this.enabled) this.orbit.update(); }

  private pick(event: MouseEvent): void {
    if (!this.enabled || event.button !== 0) return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const candidates = this.scene.children.filter(object => object.userData.editorObject === true);
    const hits = this.raycaster.intersectObjects(candidates, true);
    const object = hits[0]?.object;
    const root = object ? this.findEditableRoot(object) : undefined;
    this.select(root);
  }

  private findEditableRoot(object: THREE.Object3D): THREE.Object3D | undefined {
    let current: THREE.Object3D | null = object;
    while (current && current.parent !== this.scene) current = current.parent;
    return current?.userData.editorObject === true ? current : undefined;
  }

  private select(object?: THREE.Object3D): void {
    this.selected = object;
    this.gizmo.detach();
    if (object) this.gizmo.attach(object);
    this.refreshHierarchy();
    this.refreshDetails();
  }

  private addPrimitive(kind: 'cube' | 'sphere'): void {
    const geometry = kind === 'cube' ? new THREE.BoxGeometry(1, 1, 1) : new THREE.SphereGeometry(0.6, 24, 16);
    const material = new THREE.MeshStandardMaterial({ color: kind === 'cube' ? 0x8eaf72 : 0x75a9bd, roughness: 0.55 });
    const mesh = new THREE.Mesh(geometry, material) as Editable;
    mesh.name = kind === 'cube' ? 'Cube' : 'Sphere';
    mesh.position.set(0, 1, 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.editorObject = true;
    this.scene.add(mesh);
    this.select(mesh);
  }

  private addLight(): void {
    const light = new THREE.PointLight(0xffd49a, 18, 18) as THREE.PointLight & { userData: { [key: string]: unknown } };
    light.name = 'Point Light';
    light.position.set(0, 3, 0);
    light.userData.editorObject = true;
    this.scene.add(light);
    const helper = new THREE.PointLightHelper(light, 0.25);
    helper.userData.editorHelper = true;
    light.add(helper);
    this.select(light);
  }

  private removeSelected(): void {
    if (!this.selected || this.selected.userData.editorObject !== true) return;
    const object = this.selected;
    this.select(undefined);
    this.scene.remove(object);
    object.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach(material => material.dispose());
      }
    });
    this.refreshHierarchy();
  }

  private refreshHierarchy(): void {
    this.hierarchy.replaceChildren();
    const objects = this.scene.children.filter(object => object.userData.editorObject === true);
    if (!objects.length) {
      const empty = document.createElement('p'); empty.textContent = 'Brak obiektów użytkownika.'; this.hierarchy.appendChild(empty); return;
    }
    for (const object of objects) {
      const row = document.createElement('button');
      row.className = 'hierarchy-item' + (object === this.selected ? ' selected' : '');
      row.textContent = (object instanceof THREE.Light ? '◉ ' : '◇ ') + (object.name || object.type);
      row.addEventListener('click', () => this.select(object));
      this.hierarchy.appendChild(row);
    }
  }

  private refreshDetails(): void {
    this.details.replaceChildren();
    if (!this.selected) {
      const empty = document.createElement('p'); empty.textContent = 'Wybierz obiekt w scenie.'; this.details.appendChild(empty); return;
    }
    const title = document.createElement('strong'); title.textContent = this.selected.name || this.selected.type; this.details.appendChild(title);
    const fields: Array<[string, THREE.Vector3]> = [['Pozycja', this.selected.position], ['Rotacja', this.selected.rotation as unknown as THREE.Vector3], ['Skala', this.selected.scale]];
    for (const [label, vector] of fields) {
      const row = document.createElement('div'); row.className = 'transform-row';
      const caption = document.createElement('label'); caption.textContent = label; row.appendChild(caption);
      for (const axis of ['x', 'y', 'z'] as const) {
        const input = document.createElement('input'); input.type = 'number'; input.step = '0.1'; input.value = vector[axis].toFixed(2); input.setAttribute('aria-label', label + ' ' + axis);
        input.addEventListener('change', () => {
          const value = Number(input.value);
          if (!Number.isFinite(value)) return;
          vector[axis] = value;
          this.selected?.updateMatrixWorld(true);
          this.refreshDetails();
        });
        row.appendChild(input);
      }
      this.details.appendChild(row);
    }
  }

  private exportScene(): void {
    const objects = this.scene.children.filter(object => object.userData.editorObject === true).map(object => ({
      name: object.name, type: object.type,
      position: object.position.toArray(), rotation: object.rotation.toArray(), scale: object.scale.toArray(),
      color: object instanceof THREE.Mesh && object.material instanceof THREE.MeshStandardMaterial ? '#' + object.material.color.getHexString() : undefined
    }));
    const blob = new Blob([JSON.stringify({ format: 'outlands-scene', version: 1, objects }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'outlands-scene.json'; anchor.click();
    URL.revokeObjectURL(url);
  }

  dispose(): void {
    this.setEnabled(false);
    this.renderer.domElement.removeEventListener('click', this.onCanvasClick);
    window.removeEventListener('keydown', this.onKey);
    this.gizmo.dispose();
    this.orbit.dispose();
    this.panel.remove();
  }
}
