import { jest, describe, expect, test } from "@jest/globals";
import { ExternalForce } from "../diagram_elements/ExternalForce";
import { MockedObject } from "jest-mock";
import { ExternalForceEntity } from "./ExternalForceEntity";
import { Point } from "../diagram_elements/Point";
import { Painter } from "../painters/Painter";
import { EntityPrefix } from "../../utils/Constants";
import { setMockProperty } from "../../utils/TestUtils";
import { MovePointEvent } from "../Event";
import { fabric } from "fabric";

describe("ExternalForceEntity", () => {
  let point: MockedObject<Point>;
  let externalForce: MockedObject<ExternalForce>;
  let eventMediator: MockedObject<Painter>;
  let externalForceEntity: ExternalForceEntity;
  let canvas: MockedObject<fabric.Canvas>;

  beforeEach(() => {
    point = jest.createMockFromModule<Point>("../diagram_elements/Point");
    externalForce = jest.createMockFromModule<ExternalForce>(
      "../diagram_elements/ExternalForce"
    );
    eventMediator = jest.createMockFromModule<Painter>("../painters/Painter");
    canvas = jest.mocked(new fabric.Canvas(null));
  });

  describe("getObjectsToDraw", () => {
    test("Should return an array of Fabric Object with name and type in its data", () => {
      setMockProperty(externalForce, "name", "F1");
      setMockProperty(externalForce, "id", 1);

      externalForceEntity = new ExternalForceEntity(
        externalForce,
        point,
        eventMediator,
        canvas
      );

      const actualObjects = externalForceEntity.getObjectsToDraw();
      const expectedObject = {
        name: "F1",
        id: 1,
        type: EntityPrefix.FORCE,
      };

      expect(actualObjects.data).toStrictEqual(expectedObject);
    });
  });

  describe("updatePosition", () => {
    test("Should update the position of the icon", () => {
      setMockProperty(externalForce, "name", "F1");
      setMockProperty(externalForce, "id", 1);
      externalForceEntity = new ExternalForceEntity(
        externalForce,
        point,
        eventMediator,
        canvas
      );

      const movePointEvent: MovePointEvent = {
        id: 1,
        source: 0,
        coordinate: { x: 20, y: 10 },
      };

      externalForceEntity.updatePosition(movePointEvent);

      const actualIcon = externalForceEntity.getObjectsToDraw();

      expect(actualIcon?.top).toBe(10);
      expect(actualIcon?.left).toBe(20);
    });
  });

  describe("setForceComponents", () => {
    test("Should update the rotation of the icon to appropriate value", () => {
      setMockProperty(externalForce, "name", "F1");
      externalForceEntity = new ExternalForceEntity(
        externalForce,
        point,
        eventMediator,
        canvas
      );

      externalForceEntity.setForceComponents(100, 0);

      const actualIcon = externalForceEntity.getObjectsToDraw();

      expect(actualIcon?.angle).toBe(-90);
    });

    test("Should update the values of the element", () => {
      setMockProperty(externalForce, "name", "F1");
      const [, setFx] = setMockProperty(externalForce, "F_x", 10);
      const [, setFy] = setMockProperty(externalForce, "F_y", 20);

      externalForceEntity = new ExternalForceEntity(
        externalForce,
        point,
        eventMediator,
        canvas
      );

      externalForceEntity.setForceComponents(100, 0);

      expect(setFx).toBeCalledTimes(1);
      expect(setFx).toBeCalledWith(100);

      expect(setFy).toBeCalledTimes(1);
      expect(setFy).toBeCalledWith(0);
    });
  });
});
