import { jest, describe, expect, test } from "@jest/globals";
import { ExternalForce } from "../ExternalForce";
import { MockedObject } from "jest-mock";
import { ExternalForceEntity } from "./ExternalForceEntity";
import { Point } from "../Point";
import { Painter } from "../painters/Painter";
import { ElementType } from "../../utils/Constants";
import { setMockProperty } from "../../utils/TestUtils";
import { MovePointEvent } from "../Event";

describe("ExternalForceEntity", () => {
  let point: MockedObject<Point>;
  let externalForce: MockedObject<ExternalForce>;
  let eventMediator: MockedObject<Painter>;
  let externalForceEntity: ExternalForceEntity;

  beforeEach(() => {
    point = jest.createMockFromModule<Point>("../Point");
    externalForce =
      jest.createMockFromModule<ExternalForce>("../ExternalForce");
    eventMediator = jest.createMockFromModule<Painter>("../painters/Painter");
  });

  describe("getObjectsToDraw", () => {
    test("Should return an array of Fabric Object with name and type in its data", () => {
      setMockProperty(externalForce, "name", "F1");

      externalForceEntity = new ExternalForceEntity(
        externalForce,
        point,
        eventMediator
      );

      const actualObjects = externalForceEntity.getObjectsToDraw();
      const expectedObject = {
        name: "F1",
        type: ElementType.FORCE,
      };

      expect(actualObjects.length).toBe(1);
      expect(actualObjects[0].data).toStrictEqual(expectedObject);
    });
  });

  describe("updatePosition", () => {
    test("Should update the position of the icon", () => {
      setMockProperty(externalForce, "name", "F1");
      externalForceEntity = new ExternalForceEntity(
        externalForce,
        point,
        eventMediator
      );

      const movePointEvent: MovePointEvent = {
        name: "P1",
        source: "user",
        coordinate: { x: 20, y: 10 },
      };

      externalForceEntity.updatePosition(movePointEvent);

      const actualIcon = externalForceEntity.getObjectsToDraw();

      expect(actualIcon?.[0].top).toBe(10);
      expect(actualIcon?.[0].left).toBe(20);
    });
  });
});
