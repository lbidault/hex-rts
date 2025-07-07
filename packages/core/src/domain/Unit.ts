export type Position = { x: number; y: number };
export type UnitId = string;

export class Unit {
  constructor(
    public readonly id: UnitId,
    public position: Position,
    public selected: boolean = false
  ) {}

  moveTo(target: Position): void {
    this.position = target;
  }
}