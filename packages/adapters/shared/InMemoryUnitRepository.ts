import { UnitRepository } from "../../core/ports/UnitRepository";
import { Unit } from "../../core/domain/Unit";

export class InMemoryUnitRepository implements UnitRepository {
  private units = new Map<Unit["id"], Unit>();

  getById(id: string) {
    return this.units.get(id) ?? null;
  }

  getAll() {
    return Array.from(this.units.values());
  }

  save(unit: Unit) {
    this.units.set(unit.id, unit);
  }
}