import { UnitRepository } from "../ports/UnitRepository";
import { UnitId } from "../domain/Unit";
import { Command } from "../ports/Command";

export class SelectUnitCommand implements Command {
  constructor(
    private repository: UnitRepository,
    private unitId: UnitId
  ) {}

  execute() {
    // Deselect all first
    this.repository.getAll().forEach(u => {
      u.selected = false;
      this.repository.save(u);
    });

    const unit = this.repository.getById(this.unitId);
    if (unit) {
      unit.selected = true;
      this.repository.save(unit);
    }
  }
}
