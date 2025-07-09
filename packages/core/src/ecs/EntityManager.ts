import { ComponentStore } from "./ComponentStore";
import { PositionComponent } from "./components/Position";
import { SelectedComponent } from "./components/Selected";
import { TargetPositionComponent } from "./components/TargetPosition";
import { VelocityComponent } from "./components/Velocity";

export class EntityManager {
  private entities = new Set<string>();
  public selectedEntityIds = new Set<string>();

  // Stockage des composants
  public positionComponents = new ComponentStore<PositionComponent>();
  public velocityComponents = new ComponentStore<VelocityComponent>();
  public targetPositionComponents =
    new ComponentStore<TargetPositionComponent>();

  createEntity(): string {
    const id = Math.random().toString(36).slice(2);
    this.entities.add(id);
    return id;
  }

  removeEntity(id: string) {
    this.entities.delete(id);
    this.selectedEntityIds.delete(id);
    this.positionComponents.remove(id);
    this.velocityComponents.remove(id);
    this.targetPositionComponents.remove(id);
  }

  getEntities(): string[] {
    return Array.from(this.entities);
  }
}
