import { Unit, UnitId } from "../domain/Unit";

export interface UnitRepository {
  getById(id: UnitId): Unit | null;
  getAll(): Unit[];
  save(unit: Unit): void;
}