import { Vector } from "../utils/math";

export type InputButton = "LEFT" | "RIGHT";
export type InputEvent = {
  type: "POINTER_DOWN" | "POINTER_MOVE" | "POINTER_UP" | "DOUBLE_TAP";
  position: Vector;
  button: InputButton;
  timestamp: number;
};
