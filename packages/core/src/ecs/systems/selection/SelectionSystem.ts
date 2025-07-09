import { GameWorld } from "../../../game/GameWorld";
import { Position, distance } from "../../../utils/math";
import { SelectionArea } from "./SelectionArea";

export const UNIT_SELECT_RADIUS = 25;

export class SelectionSystem {
  constructor(private world: GameWorld) {}

  selectSingle(entityId: string) {
    this.clearSelection();
    if (this.world.positions.has(entityId)) {
      this.world.selections.add(entityId, true);
    }
  }

  selectMultiple(entityIds: string[]) {
    this.clearSelection();
    entityIds.forEach((id) => {
      if (this.world.positions.has(id)) {
        this.world.selections.add(id, true);
      }
    });
  }

  clearSelection() {
    this.world.selections.getAll().forEach(([id]) => {
      this.world.selections.remove(id);
    });
  }

  findEntityAtPosition(pos: Position): string | undefined {
    return this.world.positions
      .getAll()
      .find(([, p]) => distance(p, pos) < UNIT_SELECT_RADIUS)?.[0];
  }

  findEntitiesInArea(area: SelectionArea): string[] {
    return this.world.positions
      .getAll()
      .filter(([, p]) => area.contains(p))
      .map(([id]) => id);
  }

  getSelectedEntities(): string[] {
    return this.world.selections.getAll().map(([id]) => id);
  }

  selectEntitiesInArea(area: SelectionArea) {
    const ids = this.findEntitiesInArea(area);
    this.selectMultiple(ids);
  }

  previewSelectionArea(area: SelectionArea): string[] {
    return this.findEntitiesInArea(area);
  }
}
