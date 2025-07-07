import { useEffect, useRef, useState } from "react";
import { Unit } from "../../../../packages/core/src/domain/Unit";
import { CommandService } from "../../../../packages/core/src/services/CommandService";
import { SelectUnitCommand } from "../../../../packages/core/src/services/SelectUnitCommand";
import { InMemoryUnitRepository } from "../../../../packages/adapters/src/shared/InMemoryUnitRepository";
import { CanvasRenderer } from "../../../../packages/adapters/src/client/rendering/CanvasRenderer";
import { MoveUnitCommand } from "../../../../packages/core/src/services/MoveUnitCommand";

export const useGameEngine = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [units, setUnits] = useState<Unit[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize
    const ctx = canvasRef.current.getContext("2d")!;
    const renderer = new CanvasRenderer(ctx);
    const repository = new InMemoryUnitRepository();
    const commandService = new CommandService();

    // Create test units
    const initialUnits = [
      new Unit("1", { x: 50, y: 50 }),
      new Unit("2", { x: 150, y: 150 }),
    ];
    initialUnits.forEach((u) => repository.save(u));
    setUnits(initialUnits);

    // Render loop
    const gameLoop = () => {
      renderer.clear();
      repository.getAll().forEach(renderer.renderUnit.bind(renderer));
      requestAnimationFrame(gameLoop);
    };
    gameLoop();

    // Click handler
    const handleClick = (e: MouseEvent) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      const clickPos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      // Find clicked unit (simple radius check)
      const clickedUnit = repository.getAll().find((u) => {
        const dx = u.position.x - clickPos.x;
        const dy = u.position.y - clickPos.y;
        return Math.sqrt(dx * dx + dy * dy) < 15;
      });

      if (clickedUnit) {
        const selectUnitCommand = new SelectUnitCommand(
          repository,
          clickedUnit.id
        );
        commandService.execute(selectUnitCommand);
      } else {
        // Move all selected units
        repository
          .getAll()
          .filter((u) => u.selected)
          .forEach((u) =>
            commandService.execute(
              new MoveUnitCommand(repository, u.id, clickPos)
            )
          );
      }

      setUnits([...repository.getAll()]);
    };

    canvasRef.current.addEventListener("click", handleClick);
    return () => canvasRef.current?.removeEventListener("click", handleClick);
  }, []);

  return { canvasRef, units };
};
