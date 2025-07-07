import { useGameEngine } from "./hooks/useGameEngine";

export const GameCanvas = () => {
  const { canvasRef } = useGameEngine();

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      style={{ border: "1px solid black" }}
    />
  );
};