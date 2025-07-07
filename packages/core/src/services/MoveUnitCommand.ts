import { UnitRepository } from "../ports/UnitRepository";
import { UnitId, Position } from "../domain/Unit";
import { Command } from "../ports/Command";

export class MoveUnitCommand implements Command {
  constructor(
    private repository: UnitRepository,
    private unitId: UnitId,
    private target: Position
  ) {}

  execute() {
    const unit = this.repository.getById(this.unitId);
    if (unit?.selected) {
      unit.moveTo(this.target);
      this.repository.save(unit);
    }
  }
}