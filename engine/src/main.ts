import * as THREE from 'three';
import './style.css';
import { Engine, Input, PhysicsWorld } from './index';

// OUTLANDS ENGINE — rendering and input foundation.
const viewport = document.querySelector<HTMLDivElement>('#viewport');
const fpsLabel = document.querySelector<HTMLSpanElement>('#fps');
if (!viewport) throw new Error('Missing #viewport');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9ab7b5);
scene.fog = new THREE.Fog(0x9ab7b5, 28, 100);

const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 180);
camera.position.set(0, 3.2, 7);

const engine = new Engine({ canvasHost: viewport, scene, camera, maxPixelRatio: 2, shadows: true });
const renderer = engine.renderer;
const input = new Input();
const physics = new PhysicsWorld();
void physics.initialize().then(() => {
  physics.createGround({ x: 90, y: 0.5, z: 90 });
  console.info('[OUTLANDS ENGINE] Rapier physics initialized (fixed 60 Hz)');
}).catch(error => console.error('[OUTLANDS ENGINE] Physics initialization failed', error));

// Lighting
scene.add(new THREE.HemisphereLight(0xdceeff, 0x52634a, 2.0));
const sun = new THREE.DirectionalLight(0xffe4bd, 3.2);
sun.position.set(-12, 20, 9);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -28; sun.shadow.camera.right = 28;
sun.shadow.camera.top = 28; sun.shadow.camera.bottom = -28;
scene.add(sun);

// Ground and grid
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(180, 180),
  new THREE.MeshStandardMaterial({ color: 0x637d57, roughness: 1 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);
const grid = new THREE.GridHelper(180, 90, 0x829b70, 0x829b70);
grid.position.y = 0.012;
(grid.material as THREE.Material).opacity = 0.12;
(grid.material as THREE.Material).transparent = true;
scene.add(grid);

// A simple original training island: rocks, hills and pine-like trees.
const rockMat = new THREE.MeshStandardMaterial({ color: 0x687a78, roughness: 0.95 });
for (let i = 0; i < 34; i++) {
  const angle = (i / 34) * Math.PI * 2;
  const radius = 17 + Math.sin(i * 4.7) * 5;
  const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(1.8 + (i % 4) * 0.55, 0), rockMat);
  rock.position.set(Math.cos(angle) * radius, 0.6, Math.sin(angle) * radius);
  rock.scale.y = 0.7 + (i % 3) * 0.35;
  rock.rotation.set(i * 0.3, i, i * 0.17);
  rock.castShadow = true; rock.receiveShadow = true; scene.add(rock);
}
const trunkMat = new THREE.MeshStandardMaterial({ color: 0x594333 });
const leafMat = new THREE.MeshStandardMaterial({ color: 0x294b3b, roughness: 1 });
for (let i = 0; i < 48; i++) {
  const x = Math.sin(i * 91.7) * 28;
  const z = Math.cos(i * 37.2) * 28;
  if (Math.hypot(x, z) < 8) continue;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.24, 1.5, 7), trunkMat);
  trunk.position.set(x, 0.75, z); trunk.castShadow = true; scene.add(trunk);
  const crown = new THREE.Mesh(new THREE.ConeGeometry(1.05, 3.2, 7), leafMat);
  crown.position.set(x, 2.65, z); crown.castShadow = true; scene.add(crown);
}

// Player placeholder
const player = new THREE.Group();
const body = new THREE.Mesh(
  new THREE.CapsuleGeometry(0.48, 1.05, 5, 10),
  new THREE.MeshStandardMaterial({ color: 0xb6e36b, roughness: 0.65 })
);
body.position.y = 1.05; body.castShadow = true; player.add(body);
const visor = new THREE.Mesh(
  new THREE.BoxGeometry(0.52, 0.2, 0.12),
  new THREE.MeshStandardMaterial({ color: 0x18282b, metalness: 0.25, roughness: 0.25 })
);
visor.position.set(0, 1.55, -0.43); player.add(visor);
player.position.set(0, 0, 0);
scene.add(player);

// Controls: keyboard movement + pointer-lock mouse look.
const keys = input;
renderer.domElement.addEventListener('click', () => renderer.domElement.requestPointerLock());
let yaw = 0;
let pitch = -0.12;
document.addEventListener('mousemove', e => {
  if (document.pointerLockElement !== renderer.domElement) return;
  yaw -= e.movementX * 0.0022;
  pitch = THREE.MathUtils.clamp(pitch - e.movementY * 0.0018, -0.65, 0.45);
});

engine.onFrame((dt) => {
  physics.step(dt);
  const forward = Number(keys.isDown('KeyW')) - Number(keys.isDown('KeyS'));
  const side = Number(keys.isDown('KeyD')) - Number(keys.isDown('KeyA'));
  const direction = new THREE.Vector3(side, 0, -forward);
  if (direction.lengthSq() > 0) {
    direction.normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
    player.position.addScaledVector(direction, 6 * dt);
    player.rotation.y = Math.atan2(-direction.x, -direction.z);
  }
  const target = player.position.clone().add(new THREE.Vector3(0, 1.7, 0));
  const distance = 7;
  const offset = new THREE.Vector3(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch)).multiplyScalar(distance);
  camera.position.lerp(target.clone().add(offset), 1 - Math.pow(0.001, dt));
  camera.lookAt(target);
  if (fpsLabel) fpsLabel.textContent = 'FPS ' + engine.fps + ' · ' + engine.frameTimeMs.toFixed(1) + ' MS';
  keys.endFrame();
});
engine.start();

addEventListener('pagehide', () => { engine.dispose(); input.dispose(); physics.dispose(); }, { once: true });
console.info('[OUTLANDS ENGINE] runtime ready');
