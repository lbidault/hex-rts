import { CommandService } from "./CommandService";
import { Unit } from "../domain/Unit";
import { InMemoryUnitRepository } from "../../../adapters/src/shared/InMemoryUnitRepository";
import { SelectUnitCommand } from "./SelectUnitCommand";
import { MoveUnitCommand } from "./MoveUnitCommand";

describe("CommandService", () => {
  let service: CommandService;
  let repository: InMemoryUnitRepository;

  beforeEach(() => {
    repository = new InMemoryUnitRepository();
    service = new CommandService();
  });

  it("executes any command", () => {
    const mockCommand = { execute: jest.fn() };
    const service = new CommandService();

    service.execute(mockCommand);
    expect(mockCommand.execute).toHaveBeenCalled();
  });

  it("SelectUnitCommand: should select a unit and deselect others", () => {
    const unit1 = new Unit("1", { x: 0, y: 0 });
    const unit2 = new Unit("2", { x: 10, y: 10 });
    unit2.selected = true;
    repository.save(unit1);
    repository.save(unit2);

    const command = new SelectUnitCommand(repository, "1");
    service.execute(command);

    expect(unit1.selected).toBe(true);
    expect(unit2.selected).toBe(false);
  });

  it("MoveUnitCommand: should move selected units", () => {
    const unit = new Unit("1", { x: 0, y: 0 });
    unit.selected = true;
    repository.save(unit);

    const command = new MoveUnitCommand(repository, "1", { x: 5, y: 5 });
    service.execute(command);

    expect(unit.position).toEqual({ x: 5, y: 5 });
  });
});
