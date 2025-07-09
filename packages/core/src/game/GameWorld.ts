import { EntityManager } from "../ecs/EntityManager";
import { ComponentStore } from "../ecs/ComponentStore";
import { Position } from "../utils/math";

// import { SelectedComponent } from "../ecs/SelectedComponent";

export class GameWorld {
  readonly entityManager = new EntityManager();

  // Composants
  readonly positions = new ComponentStore<Position>();
  readonly selections = new ComponentStore<true>(); // ou SelectedComponent

  constructor() {}

  getEntities(): string[] {
    return this.entityManager.getEntities();
  }
}
