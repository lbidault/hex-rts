import { SelectionArea } from "../ecs/systems/selection/SelectionArea";
import { Position } from "../utils/math";

export interface RenderableEntity {
  id: string;
  position: Position;
  selected: boolean;
}

export interface Renderer {
  clear(): void;
  renderUnit(entity: RenderableEntity): void;
  renderSelectionArea(): void;
}
