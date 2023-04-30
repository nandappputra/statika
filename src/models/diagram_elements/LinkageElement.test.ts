import { jest, describe, expect, test } from "@jest/globals";
import { MockedObject } from "jest-mock";
import { LinkageElement } from "../diagram_elements/LinkageElement";
import { Point } from "../Point";
import { setMockProperty } from "../../utils/TestUtils";

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

  describe("removePoint", () => {
    test("Should remove the correct point from the linkage", () => {
      linkageElement = new LinkageElement("L1", point1, point2);

      const point3 = new Point("P3", 1, 2);
      const point4 = new Point("P4", 3, 5);

      linkageElement.addPoint(point3);
      linkageElement.addPoint(point4);
      linkageElement.removePoint(point3);

      expect(linkageElement.points.length).toBe(3);
      expect(linkageElement.points[2]).toStrictEqual(point4);
    });
  });

  describe("generateEquilibrium", () => {
    test("Should generate the correct equilibrium equation formatted for the solver", () => {
      setMockProperty(point1, "symbolF_x", "F_P1x+10+2+3");
      setMockProperty(point1, "symbolF_y", "F_P1y+0+1");
      setMockProperty(point1, "symbolM_z", "M_P1z");

      setMockProperty(point2, "symbolF_x", "F_P2x+0+-5");
      setMockProperty(point2, "symbolF_y", "F_P2y+0+-1");
      setMockProperty(point2, "symbolM_z", "0");

      setMockProperty(point1, "x", "0");
      setMockProperty(point1, "y", "0");

      setMockProperty(point2, "x", "30");
      setMockProperty(point2, "y", "40");
      linkageElement = new LinkageElement("L1", point1, point2);

      const actualEquations = linkageElement.generateEquilibrium();
      const expectedEquations = [
        "1*F_P1x+10+2+3+1*F_P2x+0+-5",
        "1*F_P1y+0+1+1*F_P2y+0+-1",
        "0*F_P1x+0+0+0+0*F_P1y+0+0+1*M_P1z+40*F_P2x+0+-200+-30*F_P2y+0+30+0",
      ];

      expect(actualEquations).toStrictEqual(expectedEquations);
    });

    test("Should generate the correct when the force equation is composed of numbers only", () => {
      setMockProperty(point1, "symbolF_x", "F_P1x+10+2+3");
      setMockProperty(point1, "symbolF_y", "F_P1y+0+1");
      setMockProperty(point1, "symbolM_z", "M_P1z");

      setMockProperty(point2, "symbolF_x", "F_P2x+0+-5");
      setMockProperty(point2, "symbolF_y", "10+5");
      setMockProperty(point2, "symbolM_z", "0");

      setMockProperty(point1, "x", "0");
      setMockProperty(point1, "y", "0");

      setMockProperty(point2, "x", "30");
      setMockProperty(point2, "y", "40");
      linkageElement = new LinkageElement("L1", point1, point2);

      const actualEquations = linkageElement.generateEquilibrium();
      const expectedEquations = [
        "1*F_P1x+10+2+3+1*F_P2x+0+-5",
        "1*F_P1y+0+1+10+5",
        "0*F_P1x+0+0+0+0*F_P1y+0+0+1*M_P1z+40*F_P2x+0+-200+-300+-150+0",
      ];

      expect(actualEquations).toStrictEqual(expectedEquations);
    });
  });
});
