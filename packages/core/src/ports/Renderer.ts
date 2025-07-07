import { Unit } from "../domain/Unit";

export interface Renderer {
  clear(): void;
  renderUnit(unit: Unit): void;
}