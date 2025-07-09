import { Vector2D } from "../../../utils/math";

export class SelectionArea {
  constructor(public readonly start: Vector2D, public readonly end: Vector2D) {}

  contains(position: Vector2D): boolean {
    const minX = Math.min(this.start.x, this.end.x);
    const maxX = Math.max(this.start.x, this.end.x);
    const minY = Math.min(this.start.y, this.end.y);
    const maxY = Math.max(this.start.y, this.end.y);

    return (
      position.x >= minX &&
      position.x <= maxX &&
      position.y >= minY &&
      position.y <= maxY
    );
  }

  get width(): number {
    return Math.abs(this.end.x - this.start.x);
  }

  get height(): number {
    return Math.abs(this.end.y - this.start.y);
  }

  toRect() {
    const x = Math.min(this.start.x, this.end.x);
    const y = Math.min(this.start.y, this.end.y);
    const width = Math.abs(this.end.x - this.start.x);
    const height = Math.abs(this.end.y - this.start.y);
    return { x, y, width, height };
  }
}
