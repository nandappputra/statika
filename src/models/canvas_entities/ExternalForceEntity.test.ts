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

  describe("setForceComponents", () => {
    test("Should update the rotation of the icon to appropriate value", () => {
      setMockProperty(externalForce, "name", "F1");
      externalForceEntity = new ExternalForceEntity(
        externalForce,
        point,
        eventMediator
      );

      externalForceEntity.setForceComponents(100, 0);

      const actualIcon = externalForceEntity.getObjectsToDraw();

      expect(actualIcon?.[0].angle).toBe(-90);
    });

    test("Should update the values of the element", () => {
      setMockProperty(externalForce, "name", "F1");
      const [, setFx] = setMockProperty(externalForce, "F_x", 10);
      const [, setFy] = setMockProperty(externalForce, "F_y", 20);

      externalForceEntity = new ExternalForceEntity(
        externalForce,
        point,
        eventMediator
      );

      externalForceEntity.setForceComponents(100, 0);

      expect(setFx).toBeCalledTimes(1);
      expect(setFx).toBeCalledWith(100);

      expect(setFy).toBeCalledTimes(1);
      expect(setFy).toBeCalledWith(0);
    });
  });
});
