import RAPIER from '@dimforge/rapier3d-compat';

export interface BodyHandle {
  body: RAPIER.RigidBody;
  collider: RAPIER.Collider;
}

/** Rapier-backed fixed-step physics world. Initialize once before creating bodies. */
export class PhysicsWorld {
  private world?: RAPIER.World;
  private accumulator = 0;
  private readonly fixedStep = 1 / 60;
  private readonly maxSubSteps = 5;

  async initialize(gravity = { x: 0, y: -9.81, z: 0 }): Promise<void> {
    if (this.world) return;
    await RAPIER.init();
    this.world = new RAPIER.World(gravity);
  }

  get raw(): RAPIER.World {
    if (!this.world) throw new Error('PhysicsWorld.initialize() must be called first');
    return this.world;
  }

  createGround(halfExtents = { x: 100, y: 0.5, z: 100 }): BodyHandle {
    const body = this.raw.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(0, -0.5, 0));
    const collider = this.raw.createCollider(RAPIER.ColliderDesc.cuboid(halfExtents.x, halfExtents.y, halfExtents.z), body);
    return { body, collider };
  }

  createDynamicBox(position: { x: number; y: number; z: number }, halfExtents = { x: 0.5, y: 0.5, z: 0.5 }): BodyHandle {
    const body = this.raw.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(position.x, position.y, position.z).setCcdEnabled(true));
    const collider = this.raw.createCollider(RAPIER.ColliderDesc.cuboid(halfExtents.x, halfExtents.y, halfExtents.z).setFriction(0.8), body);
    return { body, collider };
  }

  step(deltaSeconds: number): void {
    if (!this.world) return;
    this.accumulator += Math.min(deltaSeconds, 0.1);
    let steps = 0;
    while (this.accumulator >= this.fixedStep && steps < this.maxSubSteps) {
      this.world.timestep = this.fixedStep;
      this.world.step();
      this.accumulator -= this.fixedStep;
      steps++;
    }
    if (steps === this.maxSubSteps) this.accumulator = 0;
  }

  dispose(): void {
    this.world?.free();
    this.world = undefined;
    this.accumulator = 0;
  }
}
