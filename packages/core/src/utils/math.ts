export function distance(a: Vector2D, b: Vector2D): number {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

export function normalize(vector: Vector2D): Vector2D {
  const length = Math.hypot(vector.x, vector.y);
  if (length === 0) return { x: 0, y: 0 };
  return {
    x: vector.x / length,
    y: vector.y / length,
  };
}

export function scale(vector: { x: number; y: number }, scalar: number): { x: number; y: number } {
  return {
    x: vector.x * scalar,
    y: vector.y * scalar,
  };
}

export type Vector2D = { x: number; y: number };