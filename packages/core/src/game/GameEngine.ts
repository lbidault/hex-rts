import { GameLoop } from "./GameLoop";
import { SelectionSystem } from "../ecs/systems/selection/SelectionSystem";
// import { MovementSystem } from "../ecs/systems/mouvement/MouvementSystem";
import { Renderer } from "../ports/Renderer"; // ou autre renderer
import { Vector } from "../utils/math";
import { MovementSystem } from "../ecs/systems/movement/MovementSystem";
import { EntityManager } from "../ecs/EntityManager";

const DEFAULT_UNITS: { position: Vector }[] = [
  { position: { x: 50, y: 50 } },
  { position: { x: 150, y: 150 } },
];

export class GameEngine {
  public readonly entityManager: EntityManager;
  private readonly loop: GameLoop;
  private readonly renderer?: Renderer;

  private readonly selectionSystem: SelectionSystem;
  private readonly movementSystem: MovementSystem;

  constructor(renderer?: Renderer) {
    this.entityManager = new EntityManager();
    this.renderer = renderer;

    // Inject default units
    DEFAULT_UNITS.forEach(({ position }) => {
      const id = this.entityManager.createEntity();
      this.entityManager.positionComponents.add(id, { position });
    });

    // Init systems
    this.selectionSystem = new SelectionSystem(this.entityManager);
    this.movementSystem = new MovementSystem(this.entityManager);

    // Loop
    this.loop = new GameLoop(
      (delta: number) => {
        this.movementSystem.update(delta);
      },
      () => {
        if (!this.renderer) return;
        this.renderer.clear();
        this.entityManager.positionComponents.getAll().forEach(([id, c]) => {
          this.renderer!.renderUnit({
            id,
            position: c.position,
            selected: this.entityManager.selectedEntityIds.has(id),
          });
        });

        this.renderer.renderSelectionArea();
      }
    );
  }

  start() {
    this.loop.start();
  }

  stop() {
    this.loop.stop();
  }

  // Expose API utile
  getSelectionSystem(): SelectionSystem {
    return this.selectionSystem;
  }

  getMovementSystem(): MovementSystem {
    return this.movementSystem;
  }
}
