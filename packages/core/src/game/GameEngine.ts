import { GameWorld } from "./GameWorld";
import { GameLoop } from "./GameLoop";
import { SelectionSystem } from "../ecs/systems/selection/SelectionSystem";
// import { MovementSystem } from "../ecs/systems/mouvement/MouvementSystem";
import { Renderer } from "../ports/Renderer"; // ou autre renderer
import { Position } from "../utils/math";

const DEFAULT_UNITS: { id: string; position: Position }[] = [
  { id: "1", position: { x: 50, y: 50 } },
  { id: "2", position: { x: 150, y: 150 } },
];

export class GameEngine {
  public readonly world: GameWorld;
  private readonly loop: GameLoop;
  private readonly renderer?: Renderer;

  private readonly selectionSystem: SelectionSystem;

  constructor(renderer?: Renderer) {
    this.world = new GameWorld();
    this.renderer = renderer;

    // Inject default units
    DEFAULT_UNITS.forEach(({ id, position }) => {
      this.world.positions.add(id, position);
    });

    // Init systems
    this.selectionSystem = new SelectionSystem(this.world);

    // Loop
    this.loop = new GameLoop(
      (delta: number) => {},
      () => {
        if (!this.renderer) return;
        this.renderer.clear();
        this.world.positions.getAll().forEach(([id, pos]) => {
          this.renderer!.renderUnit({
            id,
            position: pos,
            selected: this.world.selections.has(id),
          });
        });

        this.renderer.renderSelectionArea()
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
  getWorld() {
    return this.world;
  }

  getSelectionSystem(): SelectionSystem {
    return this.selectionSystem;
  }

  // getMovementSystem(): MovementSystem {
  //   return this.movementSystem;
  // }
}
