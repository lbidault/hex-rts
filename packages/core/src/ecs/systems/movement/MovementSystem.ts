import { EntityManager } from "../../EntityManager";
import { distance, normalize, scale, Vector } from "../../../utils/math";

const SPEED = 100;

export class MovementSystem {
  constructor(private entityManager: EntityManager) {}

  update(delta: number) {
    for (const [entityId, targetComp] of this.entityManager.targetPositionComponents.getAll()) {
      const posComp = this.entityManager.positionComponents.get(entityId);
      const velComp = this.entityManager.velocityComponents.get(entityId);
      console.log(posComp, velComp)
      if (!posComp || !velComp) continue;

      const dir = {
        x: targetComp.target.x - posComp.position.x,
        y: targetComp.target.y - posComp.position.y,
      };

      const dist = distance(posComp.position, targetComp.target);

      // Si on est arrivé à destination, stop
      if (dist < 1) {
        velComp.velocity.x = 0;
        velComp.velocity.y = 0;
        this.entityManager.targetPositionComponents.remove(entityId);
        continue;
      }

      const dirNorm = normalize(dir);
      const velocity = scale(dirNorm, SPEED);

      velComp.velocity.x = velocity.x;
      velComp.velocity.y = velocity.y;

      // Déplacement
      posComp.position.x += velComp.velocity.x * delta;
      posComp.position.y += velComp.velocity.y * delta;
    }
  }

  orderMoveTo(entityIds: string[], target: Vector) {
    for (const entityId of entityIds) {
      this.entityManager.targetPositionComponents.add(entityId, { target });

      if (!this.entityManager.velocityComponents.has(entityId)) {
        this.entityManager.velocityComponents.add(entityId, {
          velocity: { x: 0, y: 0 },
        });
      }
    }
  }
}
