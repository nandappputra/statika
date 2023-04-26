import { jest, describe, expect, test } from "@jest/globals";
import { MockedObject } from "jest-mock";
import { Point } from "../Point";
import { ConnectionElement } from "./ConnectionElement";
import { ConnectionType } from "../../utils/Constants";

describe("LinkageEntity", () => {
  let point1: MockedObject<Point>;
  let point2: MockedObject<Point>;
  let connectionElement: ConnectionElement;

  beforeEach(() => {
    point1 = jest.createMockFromModule<Point>("../Point");
    point2 = jest.createMockFromModule<Point>("../Point");
  });

  describe("addPoint", () => {
    test("Should add a new point to the Connection points", () => {
      connectionElement = new ConnectionElement(
        "C1",
        [point1, point2],
        ConnectionType.FREE
      );

      const point3 = new Point("P3", 1, 2);
      connectionElement.addPoint(point3);

      expect(connectionElement.points.length).toBe(3);
      expect(connectionElement.points[2]).toStrictEqual(point3);
    });

    test("Should apply the boundary condition to the added point", () => {
      connectionElement = new ConnectionElement(
        "C1",
        [point1, point2],
        ConnectionType.FREE
      );

      const point3 = new Point("P3", 1, 2);
      connectionElement.addPoint(point3);

      const actualPoint = connectionElement.points[2];

      expect(actualPoint.symbolF_x).toBe("0");
      expect(actualPoint.symbolF_y).toBe("0");
      expect(actualPoint.symbolM_z).toBe("0");
    });
  });
});
