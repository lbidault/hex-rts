import { SelectionSystem, UNIT_SELECT_RADIUS } from "./SelectionSystem";
import { SelectionArea } from "./SelectionArea";
import { EntityManager } from "../../EntityManager";

describe("SelectionSystem", () => {
  let entityManager: EntityManager;
  let selectionSystem: SelectionSystem;

  beforeEach(() => {
    entityManager = new EntityManager();

    // Ajouter des entités avec positions
    entityManager.positionComponents.add("entity1", {
      position: { x: 10, y: 10 },
    });
    entityManager.positionComponents.add("entity2", {
      position: { x: 50, y: 50 },
    });
    entityManager.positionComponents.add("entity3", {
      position: { x: 100, y: 100 },
    });

    selectionSystem = new SelectionSystem(entityManager);
  });

  afterEach(() => {
    selectionSystem.clearSelection();
  });

  test("selectSingle selects one entity and clears previous selection", () => {
    selectionSystem.selectSingle("entity1");
    expect(selectionSystem.getSelectedEntities()).toEqual(["entity1"]);

    selectionSystem.selectSingle("entity2");
    expect(selectionSystem.getSelectedEntities()).toEqual(["entity2"]);
  });

  test("selectMultiple selects multiple entities and clears previous selection", () => {
    selectionSystem.selectMultiple(["entity1", "entity3"]);
    expect(selectionSystem.getSelectedEntities().sort()).toEqual([
      "entity1",
      "entity3",
    ]);
  });

  test("clearSelection clears all selections", () => {
    selectionSystem.selectMultiple(["entity1", "entity2"]);
    selectionSystem.clearSelection();
    expect(selectionSystem.getSelectedEntities()).toEqual([]);
  });

  test("findEntityAtPosition returns entity within selection radius", () => {
    const posNearEntity1 = { x: 10 + UNIT_SELECT_RADIUS - 1, y: 10 };
    expect(selectionSystem.findEntityAtPosition(posNearEntity1)).toBe(
      "entity1"
    );

    const posFar = { x: 10 + UNIT_SELECT_RADIUS + 1, y: 10 };
    expect(selectionSystem.findEntityAtPosition(posFar)).toBeUndefined();
  });

  test("findEntitiesInArea returns all entities inside the area", () => {
    const area = new SelectionArea({ x: 0, y: 0 }, { x: 60, y: 60 });
    const found = selectionSystem.findEntitiesInArea(area);
    expect(found.sort()).toEqual(["entity1", "entity2"]);
  });

  test("selectEntitiesInArea selects all entities inside the area", () => {
    const area = new SelectionArea({ x: 0, y: 0 }, { x: 60, y: 60 });
    selectionSystem.selectEntitiesInArea(area);
    expect(selectionSystem.getSelectedEntities().sort()).toEqual([
      "entity1",
      "entity2",
    ]);
  });

  test("previewSelectionArea returns entities inside the area without selecting", () => {
    const area = new SelectionArea({ x: 0, y: 0 }, { x: 60, y: 60 });
    const preview = selectionSystem.previewSelectionArea(area);
    expect(preview.sort()).toEqual(["entity1", "entity2"]);

    // Aucun changement dans la sélection actuelle
    expect(selectionSystem.getSelectedEntities()).toEqual([]);
  });
});
