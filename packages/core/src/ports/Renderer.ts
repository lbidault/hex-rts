import { Vector2D } from "../utils/math";

export interface RenderableEntity {
  id: string;
  position: Vector2D;
  selected: boolean;
}

export interface Renderer {
  clear(): void;
  renderUnit(entity: RenderableEntity): void;
  renderSelectionArea(): void;
}
