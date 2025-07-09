import { Vector, distance } from "../../../utils/math";
import { EntityManager } from "../../EntityManager";
import { SelectionArea } from "./SelectionArea";

export const UNIT_SELECT_RADIUS = 25;

export class SelectionSystem {
  constructor(private entityManager: EntityManager) {}

  selectSingle(entityId: string) {
    this.clearSelection();
    if (this.entityManager.positionComponents.has(entityId)) {
      this.entityManager.selectedEntityIds.add(entityId);
    }
  }

  selectMultiple(entityIds: string[]) {
    this.clearSelection();
    entityIds.forEach((id) => {
      if (this.entityManager.positionComponents.has(id)) {
        this.entityManager.selectedEntityIds.add(id);
      }
    });
  }

  clearSelection() {
    this.entityManager.selectedEntityIds.clear();
  }

  findEntityAtPosition(pos: Vector): string | undefined {
    return this.entityManager.positionComponents
      .getAll()
      .find(([, c]) => distance(c.position, pos) < UNIT_SELECT_RADIUS)?.[0];
  }

  findEntitiesInArea(area: SelectionArea): string[] {
    return this.entityManager.positionComponents
      .getAll()
      .filter(([, c]) => area.contains(c.position))
      .map(([id]) => id);
  }

  getSelectedEntities(): string[] {
    return Array.from(this.entityManager.selectedEntityIds);
  }

  selectEntitiesInArea(area: SelectionArea) {
    const ids = this.findEntitiesInArea(area);
    this.selectMultiple(ids);
  }

  previewSelectionArea(area: SelectionArea): string[] {
    return this.findEntitiesInArea(area);
  }
}
