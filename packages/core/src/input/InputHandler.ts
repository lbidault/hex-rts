import { Vector2D } from "../utils/math";
import { InputButton } from "./InputEvents";
import { SelectionSystem } from "../ecs/systems/selection/SelectionSystem";
import { SelectionArea } from "../ecs/systems/selection/SelectionArea";
import { MovementSystem } from "../ecs/systems/movement/MovementSystem";

export class InputHandler {
  constructor(
    private selectionSystem: SelectionSystem,
    private movementSystem: MovementSystem,
    private onSelectionAreaPreview?: (area: SelectionArea | null) => void
  ) {}

  handleSingleTap(position: Vector2D, button: InputButton) {
    if (button === "LEFT") {
      const entityId = this.selectionSystem.findEntityAtPosition(position);

      if (entityId) {
        this.selectionSystem.selectSingle(entityId);
      } else {
        this.selectionSystem.clearSelection();
      }
    } else if (button === "RIGHT") {
      // futur : déclencher un move system
      const selected = this.selectionSystem.getSelectedEntities();
      this.movementSystem.orderMoveTo(selected, position);
    }
  }

  handleDoubleTap(position: Vector2D, button: InputButton) {
    if (button !== "LEFT") return;

    const entityId = this.selectionSystem.findEntityAtPosition(position);
    if (entityId) {
      throw new Error("Not implemented: select all of type");
    }
  }

  handleDragComplete(start: Vector2D, end: Vector2D) {
    const area = new SelectionArea(start, end);
    const ids = this.selectionSystem.findEntitiesInArea(area);
    this.selectionSystem.selectMultiple(ids);
    this.onSelectionAreaPreview?.(null);
  }

  handleDrag(start: Vector2D, current: Vector2D) {
    const area = new SelectionArea(start, current);
    this.selectionSystem.previewSelectionArea(area);
    this.onSelectionAreaPreview?.(area);
  }

  private handleEditorClick(position: Vector2D, button: InputButton) {
    throw new Error("Not implemented");
  }
}
