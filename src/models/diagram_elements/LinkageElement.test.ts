import { jest, describe, expect, test } from "@jest/globals";
import { MockedObject } from "jest-mock";
import { LinkageElement } from "../diagram_elements/LinkageElement";
import { Point } from "../Point";

describe("LinkageEntity", () => {
  let point1: MockedObject<Point>;
  let point2: MockedObject<Point>;
  let linkageElement: LinkageElement;

  beforeEach(() => {
    point1 = jest.createMockFromModule<Point>("../Point");
    point2 = jest.createMockFromModule<Point>("../Point");
  });

  describe("addPoint", () => {
    test("Should add a new point to the Linkage points", () => {
      linkageElement = new LinkageElement("L1", point1, point2);

      const point3 = new Point("P3", 1, 2);

      linkageElement.addPoint(point3);

      expect(linkageElement.points.length).toBe(3);
      expect(linkageElement.points[2]).toStrictEqual(point3);
    });
  });
});
