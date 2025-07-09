import { useEffect, useRef, useState } from "react";
import { CanvasRenderer } from "@adapters/client/rendering/CanvasRenderer";
import { GameEngine } from "@core/game/GameEngine";
import { SelectionArea } from "@core/ecs/systems/selection/SelectionArea";
import { InputHandler } from "@core/input/InputHandler";
import { InputStateMachine } from "@core/input/InputStateMachine";
import { CanvasInputAdapter } from "@adapters/client/input/CanvasInputAdapter";

export const useGameEngine = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragArea, setDragArea] = useState<SelectionArea | null>(null);
  const dragAreaRef = useRef<SelectionArea | null>(null);

  const updateDragArea = (area: SelectionArea | null) => {
    dragAreaRef.current = area;
    setDragArea(area);
  };

  const engineRef = useRef<GameEngine | null>(null);

  const getDragArea = () => {
    return dragAreaRef.current;
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d")!;
    const renderer = new CanvasRenderer(ctx, getDragArea);
    const engine = new GameEngine(renderer);

    const selectionSystem = engine.getSelectionSystem();
    const handler = new InputHandler(selectionSystem, updateDragArea);
    const stateMachine = new InputStateMachine(handler);
    const input = new CanvasInputAdapter(canvasRef.current, stateMachine);

    input.setupEventListeners();

    engine.start();

    engineRef.current = engine;

    return () => {
      input.dispose();
      engine.stop();
    };
  }, []);

  return {
    canvasRef,
    dragArea,
    setDragArea,
    engine: engineRef.current, // utile pour commandes, debug
  };
};
