import { distance, Position } from "../utils/math";
import { InputHandler } from "./InputHandler";
import { InputButton, InputEvent } from "./InputEvents";

export type InputState = "IDLE" | "WAITING_DOUBLE" | "DRAGGING";
export const DRAG_MIN_DISTANCE = 5;

export class InputStateMachine {
  private currentState: InputState = "IDLE";
  private firstTap: { position: Position; timestamp: number } | null = null;
  private dragStart: Position | null = null;
  private doubleTapTimeout: number | null = null;
  private activeButton: InputButton | null = null;

  private isPointerDown = false;

  constructor(private handler: InputHandler) {}

  handleEvent(event: InputEvent) {
    if (event.type === "POINTER_DOWN") {
      this.isPointerDown = true;
      this.activeButton = event.button; // Mémoriser le bouton pressé
    } else if (event.type === "POINTER_UP") {
      this.isPointerDown = false;
      this.activeButton = null; // Réinitialiser
    }

    switch (this.currentState) {
      case "IDLE":
        this.handleIdleState(event);
        break;

      case "WAITING_DOUBLE":
        this.handleWaitingDoubleState(event);
        break;

      case "DRAGGING":
        this.handleDraggingState(event);
        break;
    }
  }

  private handleIdleState(event: InputEvent) {
    if (event.type !== "POINTER_DOWN") return;

    this.startClickSequence(event);
  }

  private handleWaitingDoubleState(event: InputEvent) {
    if (event.type === "POINTER_DOWN" && this.isDoubleTapCandidate(event)) {
      this.fireDoubleTap(event);
      return;
    }

    if (event.type === "POINTER_MOVE" && this.isDrag(event)) {
      this.cancelDoubleTapTimeout();
      this.currentState = "DRAGGING";
      this.handler.handleDrag(this.dragStart!, event.position);
    }

    if (event.type === "POINTER_UP") {
      // You released the pointer, wait to see if a double tap comes — or timeout will reset
      // Don't change state yet, but acknowledge pointer is no longer down
      return;
    }
  }

  private handleDraggingState(event: InputEvent) {
    if (event.type === "POINTER_MOVE") {
      this.handler.handleDrag(this.dragStart!, event.position);
    } else if (event.type === "POINTER_UP") {
      this.handler.handleDragComplete(this.dragStart!, event.position);
      this.reset();
    }
  }

  private startClickSequence(event: InputEvent) {
    this.firstTap = {
      position: event.position,
      timestamp: event.timestamp,
    };
    this.dragStart = event.position;
    this.currentState = "WAITING_DOUBLE";

    this.handler.handleSingleTap(this.firstTap!.position, event.button);

    this.doubleTapTimeout = window.setTimeout(() => {
      if (this.currentState === "WAITING_DOUBLE") {
        // this.handler.handleSingleTap(this.firstTap!.position, event.button);
        this.reset();
      }
    }, 300);
  }

  private fireDoubleTap(event: InputEvent) {
    this.cancelDoubleTapTimeout();
    this.handler.handleDoubleTap(this.firstTap!.position, event.button);
    this.reset();
  }

  private isDoubleTapCandidate(event: InputEvent): boolean {
    return (
      !!this.firstTap &&
      event.type === "POINTER_DOWN" &&
      distance(this.firstTap.position, event.position) < 10 &&
      event.timestamp - this.firstTap.timestamp < 300
    );
  }

  private isDrag(event: InputEvent): boolean {
    return (
      this.isPointerDown &&
      this.activeButton === "LEFT" &&
      !!this.dragStart &&
      distance(this.dragStart, event.position) > DRAG_MIN_DISTANCE
    );
  }

  private cancelDoubleTapTimeout() {
    if (this.doubleTapTimeout) {
      clearTimeout(this.doubleTapTimeout);
      this.doubleTapTimeout = null;
    }
  }

  private reset() {
    this.currentState = "IDLE";
    this.firstTap = null;
    this.dragStart = null;
    this.isPointerDown = false;
    this.cancelDoubleTapTimeout();
  }
}
