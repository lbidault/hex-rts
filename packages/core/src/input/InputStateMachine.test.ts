import { InputHandler } from "./InputHandler";
import { InputStateMachine, DRAG_MIN_DISTANCE } from "./InputStateMachine";

describe("InputStateMachine", () => {
  let handler: InputHandler;
  let stateMachine: InputStateMachine;

  beforeEach(() => {
    const mockSelectionSystem = {
      findUnitAtPosition: jest.fn(),
      clearSelection: jest.fn(),
      selectUnit: jest.fn(),
      selectUnits: jest.fn(),
      findUnitsInArea: jest.fn(),
      findSelection: jest.fn(),
      previewSelectionArea: jest.fn(),
    };

    handler = new InputHandler(mockSelectionSystem as any);

    jest.spyOn(handler, "handleSingleTap").mockImplementation(jest.fn());
    jest.spyOn(handler, "handleDoubleTap").mockImplementation(jest.fn());
    jest.spyOn(handler, "handleDrag").mockImplementation(jest.fn());
    jest.spyOn(handler, "handleDragComplete").mockImplementation(jest.fn());

    stateMachine = new InputStateMachine(handler);
  });

  it("calls handleDoubleTap on quick second click", () => {
    const position = { x: 10, y: 10 };
    const t1 = 1000;
    const t2 = 1100;

    stateMachine.handleEvent({
      type: "POINTER_DOWN",
      position,
      button: "LEFT",
      timestamp: t1,
    });
    stateMachine.handleEvent({
      type: "POINTER_DOWN",
      position,
      button: "LEFT",
      timestamp: t2,
    });

    expect(handler.handleDoubleTap).toHaveBeenCalled();
  });

  it("calls handleSingleTap if no double tap happens within 300ms", () => {
    const position = { x: 5, y: 5 };
    const timestamp = 1000;

    jest.useFakeTimers();

    stateMachine.handleEvent({
      type: "POINTER_DOWN",
      position,
      button: "LEFT",
      timestamp,
    });

    jest.advanceTimersByTime(301);

    expect(handler.handleSingleTap).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it("calls handleDrag on move after pointer down", () => {
    const start = { x: 0, y: 0 };
    const move = { x: 20, y: 20 };
    const timestamp = 1000;

    stateMachine.handleEvent({
      type: "POINTER_DOWN",
      position: start,
      button: "LEFT",
      timestamp,
    });

    stateMachine.handleEvent({
      type: "POINTER_MOVE",
      position: move,
      button: "LEFT",
      timestamp: timestamp + 10,
    });

    expect(handler.handleDrag).toHaveBeenCalledWith(start, move);
  });

  it("calls handleDragComplete on pointer up after dragging", () => {
    const start = { x: 0, y: 0 };
    const move = { x: 5 + DRAG_MIN_DISTANCE, y: 5 + DRAG_MIN_DISTANCE };

    stateMachine.handleEvent({
      type: "POINTER_DOWN",
      position: start,
      button: "LEFT",
      timestamp: 1000,
    });

    stateMachine.handleEvent({
      type: "POINTER_MOVE",
      position: move,
      button: "LEFT",
      timestamp: 1010,
    });

    stateMachine.handleEvent({
      type: "POINTER_UP",
      position: move,
      button: "LEFT",
      timestamp: 1020,
    });

    expect(handler.handleDragComplete).toHaveBeenCalledWith(start, move);
  });

  it("does not call handleDoubleTap if second click is far away", () => {
    const t1 = 1000;
    const t2 = 1100;

    stateMachine.handleEvent({
      type: "POINTER_DOWN",
      position: { x: 0, y: 0 },
      button: "LEFT",
      timestamp: t1,
    });

    stateMachine.handleEvent({
      type: "POINTER_DOWN",
      position: { x: 100, y: 100 },
      button: "LEFT",
      timestamp: t2,
    });

    expect(handler.handleDoubleTap).not.toHaveBeenCalled();
  });

  it("does not call anything on POINTER_UP while idle", () => {
    stateMachine.handleEvent({
      type: "POINTER_UP",
      position: { x: 0, y: 0 },
      button: "LEFT",
      timestamp: 1000,
    });

    expect(handler.handleSingleTap).not.toHaveBeenCalled();
    expect(handler.handleDoubleTap).not.toHaveBeenCalled();
  });

  it("does not call handleDrag if pointer is not down (e.g. move after tap)", () => {
    const start = { x: 0, y: 0 };
    const move = { x: 0 + DRAG_MIN_DISTANCE + 5, y: 0 };

    // Tap and release quickly
    stateMachine.handleEvent({
      type: "POINTER_DOWN",
      position: start,
      button: "LEFT",
      timestamp: 1000,
    });

    stateMachine.handleEvent({
      type: "POINTER_UP",
      position: start,
      button: "LEFT",
      timestamp: 1010,
    });

    // Move the cursor
    stateMachine.handleEvent({
      type: "POINTER_MOVE",
      position: move,
      button: "LEFT",
      timestamp: 1020,
    });

    expect(handler.handleDrag).not.toHaveBeenCalled();
  });

});
