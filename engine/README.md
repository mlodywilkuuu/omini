# OUTLANDS ENGINE

Modular 3D runtime for the OUTLANDS project. The engine is independent from game rules and AntiCheat.

## Current modules

- `core/Engine.ts` — render lifecycle, resize handling, fixed frame timing metrics and renderer ownership.
- `core/Input.ts` — centralized keyboard state and one-frame pressed/released events.
- `core/SceneManager.ts` — asynchronous scene transitions and scene update lifecycle.
- `physics/PhysicsWorld.ts` — Rapier 3D physics with a fixed 60 Hz simulation step, a ground collider and dynamic box bodies.
- `assets/AssetManager.ts` — cached GLTF model and texture loading.
- `editor/WorldEditor.ts` — in-scene selection, object hierarchy, transform inspector, translate/rotate/scale gizmos, orbit camera and JSON scene export.

## Runtime

The root Vite app currently boots the engine runtime in `src/main.ts`. The demo scene is still a sandbox; gameplay code belongs in `../gry2` and AntiCheat belongs in `../anticheat`.

## Development

From the repository root:

```bash
npm install
npm run dev
npm run build
```

## Editor controls

- Press `F1` or click the editor button to open/close the editor.
- Add cube, sphere or point light from the toolbar.
- Select objects in the viewport or hierarchy.
- Use `Q` to translate, `W` to rotate, `E` to scale; drag the gizmo.
- Edit position, rotation and scale numerically in the inspector.
- Use the editor camera to orbit the scene and export editable objects as JSON.

## Engineering roadmap

1. Physics-to-render transform synchronization and a character controller.
2. PBR material pipeline, environment maps and post-processing.
3. Asset import pipeline, caching and resource lifetime.
4. Scene serialization and loading, undo/redo and editor selection improvements.
5. Profiling, memory budgets, automated tests and build tooling.

The project uses established libraries for low-level rendering and physics rather than attempting to recreate GPU drivers or a physics solver from scratch. The long-term goal is a capable original engine, not a claim of outperforming Unreal Engine today.
