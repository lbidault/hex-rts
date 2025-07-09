import { Position } from "../../../../core/src/utils/math";
import { InputStateMachine } from "../../../../core/src/input/InputStateMachine";

export class CanvasInputAdapter {
  constructor(
    private canvas: HTMLCanvasElement,
    private stateMachine: InputStateMachine
  ) {}

  public setupEventListeners() {
    this.canvas.addEventListener("contextmenu", this.handleContextMenu);
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
  }

  public dispose() {
    this.canvas.removeEventListener("contextmenu", this.handleContextMenu);
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    this.canvas.removeEventListener("mouseup", this.handleMouseUp);
  }

  private handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
  };

  private handleMouseDown = (e: MouseEvent) => {
    const pos = this.getNormalizedPosition(e);
    this.stateMachine.handleEvent({
      type: "POINTER_DOWN",
      position: pos,
      button: e.button === 2 ? "RIGHT" : "LEFT",
      timestamp: performance.now(),
    });
  };

  private handleMouseUp = (e: MouseEvent) => {
    const pos = this.getNormalizedPosition(e);
    this.stateMachine.handleEvent({
      type: "POINTER_UP",
      position: pos,
      button: e.button === 2 ? "RIGHT" : "LEFT",
      timestamp: performance.now(),
    });
  };

  private handleMouseMove = (e: MouseEvent) => {
    const pos = this.getNormalizedPosition(e);
    this.stateMachine.handleEvent({
      type: "POINTER_MOVE",
      position: pos,
      button: e.button === 2 ? "RIGHT" : "LEFT",
      timestamp: performance.now(),
    });
  };

  private getNormalizedPosition(e: MouseEvent): Position {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return this.normalizePosition(x, y);
  }

  private normalizePosition(x: number, y: number): Position {
    return {
      x: (x / this.canvas.width) * 800,
      y: (y / this.canvas.height) * 600,
    };
  }
}
