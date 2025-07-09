import { Position } from "../utils/math";
import { InputButton } from "./InputEvents";
import { SelectionSystem } from "../ecs/systems/selection/SelectionSystem";
import { SelectionArea } from "../ecs/systems/selection/SelectionArea";

export class InputHandler {
  constructor(
    private selectionSystem: SelectionSystem,
    private onSelectionAreaPreview?: (area: SelectionArea | null) => void
  ) {}

  handleSingleTap(position: Position, button: InputButton) {
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
      console.log("Move", selected, "to", position);
    }
  }

  handleDoubleTap(position: Position, button: InputButton) {
    if (button !== "LEFT") return;

    const entityId = this.selectionSystem.findEntityAtPosition(position);
    if (entityId) {
      throw new Error("Not implemented: select all of type");
    }
  }

  handleDragComplete(start: Position, end: Position) {
    const area = new SelectionArea(start, end);
    const ids = this.selectionSystem.findEntitiesInArea(area);
    this.selectionSystem.selectMultiple(ids);
    this.onSelectionAreaPreview?.(null);
  }

  handleDrag(start: Position, current: Position) {
    const area = new SelectionArea(start, current);
    this.selectionSystem.previewSelectionArea(area);
    this.onSelectionAreaPreview?.(area);
  }

  private handleEditorClick(position: Position, button: InputButton) {
    throw new Error("Not implemented");
  }
}
