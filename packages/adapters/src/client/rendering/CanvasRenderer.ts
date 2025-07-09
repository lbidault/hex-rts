import {
  Renderer,
  RenderableEntity,
} from "../../../../core/src/ports/Renderer";
import { SelectionArea } from "../../../../core/src/ecs/systems/selection/SelectionArea";

export class CanvasRenderer implements Renderer {
  constructor(
    private ctx: CanvasRenderingContext2D,
    private getDragArea: () => SelectionArea | null
  ) {}

  clear() {
    const { width, height } = this.ctx.canvas;
    this.ctx.clearRect(0, 0, width, height);
  }

  renderUnit(entity: RenderableEntity) {
    this.ctx.beginPath();
    this.ctx.arc(entity.position.x, entity.position.y, 10, 0, Math.PI * 2);
    this.ctx.fillStyle = entity.selected ? "blue" : "red";
    this.ctx.fill();
  }

  renderSelectionArea() {
    const dragArea = this.getDragArea();
    if(!dragArea) return;

    const { x, y, width, height } = dragArea.toRect(); // méthode à créer
    this.ctx.strokeStyle = "rgba(0, 150, 255, 0.6)";
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, width, height);
  }
}
