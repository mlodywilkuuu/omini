import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import './game.css';

const host = document.querySelector<HTMLDivElement>('#game-world')!;
const startScreen = document.querySelector<HTMLElement>('#start-screen')!;
const pauseScreen = document.querySelector<HTMLElement>('#pause-screen')!;
const startButton = document.querySelector<HTMLButtonElement>('#start-button')!;
const resumeButton = document.querySelector<HTMLButtonElement>('#resume-button')!;
const healthBar = document.querySelector<HTMLElement>('#health-bar')!;
const shieldBar = document.querySelector<HTMLElement>('#shield-bar')!;
const healthValue = document.querySelector<HTMLElement>('#health-value')!;
const shieldValue = document.querySelector<HTMLElement>('#shield-value')!;
const toast = document.querySelector<HTMLElement>('#toast')!;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9bb8b4);
scene.fog = new THREE.FogExp2(0x9bb8b4, 0.0065);
const camera = new THREE.PerspectiveCamera(72, 1, 0.1, 500);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
host.appendChild(renderer.domElement);

const resize = () => {
  const w = Math.max(1, host.clientWidth), h = Math.max(1, host.clientHeight);
  camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h, false);
};
const observer = new ResizeObserver(resize); observer.observe(host); resize();

scene.add(new THREE.HemisphereLight(0xdceeff, 0x52634a, 1.7));
scene.add(new THREE.AmbientLight(0xffffff, 0.25));
const sun = new THREE.DirectionalLight(0xffe4bd, 3.1);
sun.position.set(-45, 70, 35); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -90; sun.shadow.camera.right = 90; sun.shadow.camera.top = 90; sun.shadow.camera.bottom = -90;
sun.shadow.normalBias = 0.025; scene.add(sun);

const groundMat = new THREE.MeshStandardMaterial({ color: 0x526b45, roughness: 1 });
const ground = new THREE.Mesh(new THREE.PlaneGeometry(420, 420), groundMat);
ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

const rand = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const rockMaterial = new THREE.MeshStandardMaterial({ color: 0x727f78, roughness: 0.96 });
const treeTrunk = new THREE.MeshStandardMaterial({ color: 0x594333, roughness: 1 });
const treeLeaf = new THREE.MeshStandardMaterial({ color: 0x294b38, roughness: 1 });
const hillMat = new THREE.MeshStandardMaterial({ color: 0x657b55, roughness: 1 });
for (let i = 0; i < 22; i++) {
  const angle = i / 22 * Math.PI * 2, radius = 48 + rand(i) * 72;
  const hill = new THREE.Mesh(new THREE.ConeGeometry(10 + rand(i + 30) * 15, 20 + rand(i + 60) * 34, 7), hillMat);
  hill.position.set(Math.cos(angle) * radius, 7, Math.sin(angle) * radius); hill.scale.z = 1.4; hill.rotation.y = rand(i + 90) * 3; hill.castShadow = true; hill.receiveShadow = true; scene.add(hill);
}
const trees: THREE.Group[] = [];
for (let i = 0; i < 180; i++) {
  const angle = rand(i + 150) * Math.PI * 2, radius = 13 + rand(i + 300) * 125;
  const x = Math.cos(angle) * radius, z = Math.sin(angle) * radius;
  if (Math.hypot(x, z) < 11) continue;
  const tree = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.18, .3, 2.2, 7), treeTrunk); trunk.position.y = 1.1; trunk.castShadow = true; tree.add(trunk);
  const crown = new THREE.Mesh(new THREE.ConeGeometry(1.45, 4.2, 7), treeLeaf); crown.position.y = 3.8; crown.castShadow = true; tree.add(crown);
  tree.position.set(x, 0, z); tree.rotation.y = rand(i + 500) * Math.PI; const scale = .75 + rand(i + 700) * .8; tree.scale.setScalar(scale); scene.add(tree); trees.push(tree);
}
for (let i = 0; i < 72; i++) {
  const angle = rand(i + 900) * Math.PI * 2, radius = 16 + rand(i + 1000) * 110;
  const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2 + rand(i + 1100) * 2.5, 0), rockMaterial);
  rock.position.set(Math.cos(angle) * radius, .7, Math.sin(angle) * radius); rock.scale.y = .6 + rand(i + 1200); rock.rotation.set(rand(i) * 3, rand(i + 3) * 6, rand(i + 5) * 3); rock.castShadow = true; rock.receiveShadow = true; scene.add(rock);
}

const player = new THREE.Group();
const suit = new THREE.MeshStandardMaterial({ color: 0xb6df72, roughness: .68 });
const dark = new THREE.MeshStandardMaterial({ color: 0x203034, metalness: .25, roughness: .35 });
const torso = new THREE.Mesh(new THREE.CapsuleGeometry(.43, .72, 5, 10), suit); torso.position.y = .95; torso.castShadow = true; player.add(torso);
const head = new THREE.Mesh(new THREE.SphereGeometry(.29, 16, 12), dark); head.position.y = 1.68; head.castShadow = true; player.add(head);
const pack = new THREE.Mesh(new THREE.BoxGeometry(.48, .58, .22), dark); pack.position.set(0, 1.05, .43); player.add(pack);
scene.add(player);

const props: THREE.Mesh[] = [];
const crateMat = new THREE.MeshStandardMaterial({ color: 0x9b7747, roughness: .9 });
for (let i = 0; i < 18; i++) {
  const a = rand(i + 1400) * Math.PI * 2, r = 18 + rand(i + 1500) * 85;
  const crate = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.3, 1.5), crateMat);
  crate.position.set(Math.cos(a) * r, .65, Math.sin(a) * r); crate.rotation.y = rand(i + 1600) * 1.5; crate.castShadow = true; crate.receiveShadow = true; scene.add(crate); props.push(crate);
}
const pickupMat = new THREE.MeshStandardMaterial({ color: 0xb8f36d, emissive: 0x314d12, roughness: .35 });
const pickups: THREE.Mesh[] = [];
for (let i = 0; i < 7; i++) {
  const a = i / 7 * Math.PI * 2, r = 12 + rand(i + 1800) * 45;
  const item = new THREE.Mesh(new THREE.OctahedronGeometry(.48), pickupMat);
  item.position.set(Math.cos(a) * r, .9, Math.sin(a) * r); item.castShadow = true; scene.add(item); pickups.push(item);
}

const keys = new Set<string>();
let world: RAPIER.World;
let body: RAPIER.RigidBody;
let physicsReady = false;
let playing = false;
let yaw = Math.PI, pitch = -.18;
let health = 100, shield = 50, kills = 0;
let toastTimer = 0;
const clock = new THREE.Clock();
const up = new THREE.Vector3(0, 1, 0);
const message = (value: string) => { toast.textContent = value; toast.classList.add('show'); toastTimer = 2.2; };
const setStats = () => {
  healthBar.style.width = health + '%'; shieldBar.style.width = shield * 2 + '%';
  healthValue.textContent = String(Math.round(health)); shieldValue.textContent = String(Math.round(shield));
};

async function initPhysics() {
  await RAPIER.init();
  world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
  const floor = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(0, -.25, 0));
  world.createCollider(RAPIER.ColliderDesc.cuboid(210, .25, 210).setFriction(1), floor);
  for (const crate of props) {
    const p = crate.position;
    const fixed = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(p.x, p.y, p.z).setRotation({x:0,y:Math.sin(crate.rotation.y/2),z:0,w:Math.cos(crate.rotation.y/2)}));
    world.createCollider(RAPIER.ColliderDesc.cuboid(.75, .65, .75), fixed);
  }
  body = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 2, 0).setLinearDamping(.4).setAngularDamping(1).lockRotations().setCcdEnabled(true));
  world.createCollider(RAPIER.ColliderDesc.capsule(.58, .36).setFriction(.8).setMass(75), body);
  physicsReady = true;
}
void initPhysics().catch(error => { console.error(error); message('Błąd inicjalizacji fizyki'); });

function beginGame() {
  if (!physicsReady) { message('Ładowanie świata...'); return; }
  playing = true; startScreen.classList.add('hidden'); pauseScreen.classList.add('hidden');
  renderer.domElement.requestPointerLock();
  message('Znajdź zapasy. Uważaj na wyspę.');
}
startButton.addEventListener('click', beginGame);
resumeButton.addEventListener('click', () => { playing = true; pauseScreen.classList.add('hidden'); renderer.domElement.requestPointerLock(); });
document.addEventListener('keydown', e => { keys.add(e.code); if (e.code === 'Escape' && playing) { playing = false; pauseScreen.classList.remove('hidden'); } });
document.addEventListener('keyup', e => keys.delete(e.code));
document.addEventListener('mousemove', e => {
  if (!playing || document.pointerLockElement !== renderer.domElement) return;
  yaw -= e.movementX * .0022; pitch = THREE.MathUtils.clamp(pitch - e.movementY * .0018, -.72, .4);
});
document.addEventListener('pointerlockchange', () => {
  if (playing && document.pointerLockElement !== renderer.domElement) { playing = false; pauseScreen.classList.remove('hidden'); }
});
renderer.domElement.addEventListener('click', () => { if (playing && document.pointerLockElement !== renderer.domElement) renderer.domElement.requestPointerLock(); });

let elapsed = 0;
function frame() {
  requestAnimationFrame(frame);
  const dt = Math.min(clock.getDelta(), .05);
  elapsed += dt;
  for (const item of pickups) { item.rotation.y += dt * 1.1; item.position.y = .9 + Math.sin(elapsed * 2 + item.position.x) * .16; }
  if (toastTimer > 0) { toastTimer -= dt; if (toastTimer <= 0) toast.classList.remove('show'); }
  if (physicsReady) {
    if (playing) {
      const forward = Number(keys.has('KeyW')) - Number(keys.has('KeyS'));
      const side = Number(keys.has('KeyD')) - Number(keys.has('KeyA'));
      const move = new THREE.Vector3(side, 0, -forward);
      if (move.lengthSq() > 0) move.normalize().applyAxisAngle(up, yaw);
      const speed = keys.has('ShiftLeft') || keys.has('ShiftRight') ? 9.2 : 6.2;
      const velocity = body.linvel();
      body.setLinvel({ x: move.x * speed, y: velocity.y, z: move.z * speed }, true);
      if (keys.has('Space') && body.translation().y <= 1.08) { body.setLinvel({ x: velocity.x, y: 6.2, z: velocity.z }, true); keys.delete('Space'); }
      world.timestep = 1 / 60; world.step();
      const p = body.translation(); player.position.set(p.x, p.y - 1, p.z);
      if (move.lengthSq() > 0) player.rotation.y = Math.atan2(-move.x, -move.z);
      for (const item of pickups) {
        if (item.visible && item.position.distanceTo(player.position) < 2.1) {
          item.visible = false; shield = Math.min(100, shield + 15); setStats(); message('Zebrano zapas osłony +15');
        }
      }
      const target = player.position.clone().add(new THREE.Vector3(0, 1.25, 0));
      const offset = new THREE.Vector3(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch)).multiplyScalar(7.5);
      camera.position.lerp(target.clone().add(offset), 1 - Math.pow(.001, dt)); camera.lookAt(target);
      if (p.y < -12) { body.setTranslation({x:0,y:3,z:0}, true); health = Math.max(0, health - 15); setStats(); message('Uważaj! Spadłeś poza mapę.'); }
    } else {
      const target = new THREE.Vector3(0, 1.4, 0);
      camera.position.set(Math.sin(elapsed * .08) * 18, 8, Math.cos(elapsed * .08) * 18); camera.lookAt(target);
    }
  }
  renderer.render(scene, camera);
}
setStats(); frame();
addEventListener('pagehide', () => { observer.disconnect(); renderer.dispose(); if (physicsReady) world.free(); }, { once: true });
