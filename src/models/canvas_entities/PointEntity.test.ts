import { jest, describe, expect, test } from "@jest/globals";
import { PointEntity } from "./PointEntity";
import { Point } from "../diagram_elements/Point";
import { MockedObject } from "jest-mock";
import { Painter } from "../painters/Painter";
import { setMockProperty } from "../../utils/TestUtils";
import { EntityPrefix } from "../../utils/Constants";
import { MovePointEvent } from "../Event";
import { fabric } from "fabric";
import { Canvas } from "fabric/fabric-impl";

describe("PointEntity", () => {
  let point: MockedObject<Point>;
  let eventMediator: MockedObject<Painter>;
  let pointEntity: PointEntity;
  let canvas: MockedObject<Canvas>;

  beforeEach(() => {
    point = jest.createMockFromModule<Point>("../diagram_elements/Point");
    eventMediator = jest.createMockFromModule<Painter>("../painters/Painter");
    canvas = jest.mocked(new fabric.Canvas(null));
  });

  describe("getObjectsToDraw", () => {
    test("Should return an array of Fabric Object with name, pointName, and type in its data", () => {
      setMockProperty(point, "name", "p1");
      setMockProperty(point, "id", 1);
      pointEntity = new PointEntity(point, eventMediator, canvas);

      const actualObjects = pointEntity.getObjectsToDraw();
      const expectedObject = {
        name: "p1",
        id: 1,
        type: EntityPrefix.POINT,
      };

      expect(actualObjects.data).toStrictEqual(expectedObject);
    });
  });

  describe("updatePosition", () => {
    test("Should update the position of the icon", () => {
      setMockProperty(point, "name", "p1");
      pointEntity = new PointEntity(point, eventMediator,canvas);

      const movePointEvent: MovePointEvent = {
        id: 1,
        source: 0,
        coordinate: { x: 20, y: 10 },
      };

      pointEntity.updatePosition(movePointEvent);

      const actualIcon = pointEntity.getObjectsToDraw();

      expect(actualIcon.top).toBe(10);
      expect(actualIcon.left).toBe(20);
    });

    test("Should update the position of the element", () => {
      setMockProperty(point, "name", "p1");
      const [, setX] = setMockProperty(point, "x", 1);
      const [, setY] = setMockProperty(point, "y", 2);
      pointEntity = new PointEntity(point, eventMediator, canvas);

      const movePointEvent: MovePointEvent = {
        id: 1,
        source: 0,
        coordinate: { x: 30, y: 10 },
      };

      pointEntity.updatePosition(movePointEvent);

      expect(setX).toBeCalledTimes(1);
      expect(setX).toBeCalledWith(30);
      expect(setY).toBeCalledTimes(1);
      expect(setY).toBeCalledWith(10);
    });
  });
});
