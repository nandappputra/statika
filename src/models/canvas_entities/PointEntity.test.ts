/* eslint-disable @typescript-eslint/no-unused-vars */
import { jest, describe, expect, test } from "@jest/globals";
import { PointEntity } from "./PointEntity";
import { Point } from "../Point";
import { MockedObject } from "jest-mock";
import { Painter } from "../painters/Painter";
import { setMockProperty } from "../../utils/TestUtils";
import { ElementType } from "../../utils/Constants";
import { MovePointEvent } from "../Event";

describe("PointEntity", () => {
  let point: MockedObject<Point>;
  let eventMediator: MockedObject<Painter>;
  let pointEntity: PointEntity;

  beforeEach(() => {
    point = jest.createMockFromModule<Point>("../Point");
    eventMediator = jest.createMockFromModule<Painter>("../painters/Painter");
  });

  describe("getObjectsToDraw", () => {
    test("Should return an array of Fabric Object with name, pointName, and type in its data", () => {
      setMockProperty(point, "name", "p1");
      pointEntity = new PointEntity(point, eventMediator);

      const actualObjects = pointEntity.getObjectsToDraw();
      const expectedObject = {
        name: "p1",
        pointName: "p1",
        type: ElementType.POINT,
      };

      expect(actualObjects.length).toBe(1);
      expect(actualObjects[0].data).toStrictEqual(expectedObject);
    });
  });

  describe("updatePosition", () => {
    test("Should update the position of the icon", () => {
      setMockProperty(point, "name", "p1");
      pointEntity = new PointEntity(point, eventMediator);

      const movePointEvent: MovePointEvent = {
        name: "p1",
        source: "user",
        coordinate: { x: 20, y: 10 },
      };

      pointEntity.updatePosition(movePointEvent);

      const actualIcon = pointEntity.getObjectsToDraw()[0];

      expect(actualIcon.top).toBe(10);
      expect(actualIcon.left).toBe(20);
    });

    test("Should update the position of the element", () => {
      setMockProperty(point, "name", "p1");
      const [_getX, setX] = setMockProperty(point, "x", 1);
      const [_getY, setY] = setMockProperty(point, "y", 2);
      pointEntity = new PointEntity(point, eventMediator);

      const movePointEvent: MovePointEvent = {
        name: "p1",
        source: "user",
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
