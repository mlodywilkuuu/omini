# OUTLANDS ENGINE

Modular 3D runtime for the OUTLANDS project. The engine is independent from game rules and AntiCheat.

## Current modules

- `core/Engine.ts` — render lifecycle, resize handling, fixed frame timing metrics and renderer ownership.
- `core/Input.ts` — centralized keyboard state and one-frame pressed/released events.
- `core/SceneManager.ts` — asynchronous scene transitions and scene update lifecycle.
- `physics/PhysicsWorld.ts` — Rapier 3D physics with a fixed 60 Hz simulation step, a ground collider and dynamic box bodies.
- `assets/AssetManager.ts` — cached GLTF model and texture loading.

## Runtime

The root Vite app currently boots the engine runtime in `src/main.ts`. The demo scene is still a sandbox; gameplay code belongs in `../gry2` and AntiCheat belongs in `../anticheat`.

## Development

From the repository root:

```bash
npm install
npm run dev
npm run build
```

## Engineering roadmap

1. Scene graph, entity/component model and lifecycle.
2. Physics-to-render transform synchronization and character controller.
3. PBR material pipeline, environment maps and post-processing.
4. Asset import pipeline, caching and resource lifetime.
5. Editor viewport, hierarchy, inspector and gizmos.
6. Profiling, memory budgets, automated tests and build tooling.

The project uses established libraries for low-level rendering and physics rather than attempting to recreate GPU drivers or a physics solver from scratch. The long-term goal is a capable original engine, not a claim of outperforming Unreal Engine today.
