import { Renderer } from "../../../core/src/ports/Renderer";
import { Unit } from "../../../core/src/domain/Unit";

export class CanvasRenderer implements Renderer {
  constructor(private ctx: CanvasRenderingContext2D) {}

  clear() {
    const { width, height } = this.ctx.canvas;
    this.ctx.clearRect(0, 0, width, height);
  }

  renderUnit(unit: Unit) {
    this.ctx.beginPath();
    this.ctx.arc(unit.position.x, unit.position.y, 10, 0, Math.PI * 2);
    this.ctx.fillStyle = unit.selected ? "blue" : "red";
    this.ctx.fill();
  }
}