# OUTLANDS ENGINE

Modular Three.js + Rapier runtime for the OUTLANDS project. The engine remains independent from game rules and AntiCheat.

## Runtime modules

- `core/Engine.ts` — renderer lifecycle, responsive viewport, ACES filmic tone mapping, sRGB output, soft shadow maps, pixel-ratio controls and frame metrics.
- `core/Input.ts` — centralized keyboard state and one-frame pressed/released events.
- `core/SceneManager.ts` — asynchronous scene transitions and scene update lifecycle.
- `physics/PhysicsWorld.ts` — Rapier 3D physics with fixed 60 Hz stepping, ground and dynamic bodies.
- `assets/AssetManager.ts` — cached GLTF model and texture loading.
- `editor/WorldEditor.ts` — object hierarchy, picking, transform gizmos, inspector and scene JSON export.
- `editor/TerrainEditor.ts` — 129 × 129 editable heightfield, Raise/Lower/Smooth/Flatten sculpt brushes, brush radius/strength and heightmap JSON export.

## Rendering

The demo uses physically based Three.js materials, ACES filmic tone mapping, sRGB output, hemisphere and ambient fill, a warm directional sun, 4096² soft shadow maps, shadow bias/normal bias and distance fog. The renderer caps device pixel ratio to avoid unbounded GPU cost on high-density displays.

## Editor controls

- `F1` — World Editor: add/select objects, transform them and export `outlands-scene.json`.
- `F2` — Terrain Lab: hold left mouse button on terrain to sculpt.
- Terrain brushes: Raise, Lower, Smooth and Flatten.
- Adjust brush radius and strength; reset terrain or export `outlands-heightmap.json`.
- World Editor: `Q` translate, `W` rotate, `E` scale, Delete removes the selected editable object.

## Development

From the repository root:

```bash
npm install
npm run dev
npm run build
```

The root Vite app boots the engine sandbox in `engine/src/main.ts`. Gameplay belongs in `gry2/`; AntiCheat belongs in `anticheat/`.

## Known next engineering steps

Terrain-to-Rapier collider synchronization, physics-driven character controller, environment-map / image-based lighting, shadow cascades, post-processing (SSAO/bloom), asset import pipeline, scene loading, undo/redo, profiling and automated runtime tests. Current terrain sculpting updates the render mesh; it does not yet rebuild the Rapier collision shape.
