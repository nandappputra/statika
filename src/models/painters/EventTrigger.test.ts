import { jest, describe, expect, test } from "@jest/globals";
import { EventTrigger } from "./EventTrigger";
import { MovePointEvent } from "../Event";

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
});
