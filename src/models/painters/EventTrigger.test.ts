import { jest, describe, expect, test } from "@jest/globals";
import { EventTrigger } from "./EventTrigger";
import { MovePointEvent, ObjectSelectionEvent } from "../Event";
import { PointEntity } from "../canvas_entities/PointEntity";

describe("EventTrigger", () => {
  let eventTrigger: EventTrigger;

  beforeEach(() => {
    eventTrigger = new EventTrigger();
  });

  describe("notifyMovePointEvent", () => {
    test("Should call the movePointEventCallback", () => {
      const movePointEventCallback = jest.fn();
      eventTrigger.setMovePointEventHandler(movePointEventCallback);

      const movePointEvent: MovePointEvent = {
        name: "P1",
        source: "test",
        coordinate: { x: 10, y: 20 },
      };

      eventTrigger.notifyMovePointEvent(movePointEvent);

      expect(movePointEventCallback).toBeCalledTimes(1);
      expect(movePointEventCallback).toBeCalledWith(movePointEvent);
    });
  });

  describe("notifyObjectSelectionEvent", () => {
    test("Should call the objectSelectionEventCallback", () => {
      const objectSelectionEventCallback = jest.fn();
      eventTrigger.setObjectSelectionEventHandler(objectSelectionEventCallback);

      const pointEntity = jest.createMockFromModule<PointEntity>(
        "../canvas_entities/PointEntity"
      );

      const objectSelectionEvent: ObjectSelectionEvent = {
        name: "P1",
        entity: pointEntity,
      };

      eventTrigger.notifyObjectSelectionEvent(objectSelectionEvent);

      expect(objectSelectionEventCallback).toBeCalledTimes(1);
      expect(objectSelectionEventCallback).toBeCalledWith(objectSelectionEvent);
    });
  });
});
