import { jest, describe, expect, test } from "@jest/globals";
import { PointEntity } from "./PointEntity";
import { Point } from "../Point";
import { MockedObject } from "jest-mock";
import { Painter } from "../painters/Painter";
import { setMockProperty } from "../../utils/TestUtils";
import { ElementType } from "../../utils/Constants";

describe("PointEntity", () => {
  let point: MockedObject<Point>;
  let eventMediator: MockedObject<Painter>;
  let pointEntity: PointEntity;

  beforeAll(() => {
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
});
