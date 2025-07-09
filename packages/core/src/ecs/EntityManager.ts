import { ComponentStore } from "./ComponentStore";
import { PositionComponent } from "./components/Position";
import { SelectedComponent } from "./components/Selected";

export class EntityManager {
  private entities = new Set<string>();
  
  // Stockage des composants
  public positionComponents = new ComponentStore<PositionComponent>();
  public selectedComponents = new ComponentStore<SelectedComponent>();

  createEntity(): string {
    const id = Math.random().toString(36).slice(2);
    this.entities.add(id);
    return id;
  }

  removeEntity(id: string) {
    this.entities.delete(id);
    this.positionComponents.remove(id);
    this.selectedComponents.remove(id);
  }

  getEntities(): string[] {
    return Array.from(this.entities);
  }
}