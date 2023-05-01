import { jest, describe, expect, test } from "@jest/globals";
import { MockedObject } from "jest-mock";
import { Point } from "../Point";
import { ConnectionElement } from "./ConnectionElement";
import { ConnectionType } from "../../utils/Constants";
import { setMockProperty } from "../../utils/TestUtils";
import { ExternalForce } from "../ExternalForce";

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

  describe("removePoint", () => {
    test("Should delete the specified point from the Connection points", () => {
      connectionElement = new ConnectionElement(
        "C1",
        [point1, point2],
        ConnectionType.FREE
      );

      const point3 = new Point("P3", 1, 2);
      const point4 = new Point("P4", 3, 5);
      connectionElement.addPoint(point3);
      connectionElement.addPoint(point4);

      connectionElement.removePoint(point3);

      expect(connectionElement.points.length).toBe(3);
      expect(connectionElement.points[2]).toStrictEqual(point4);
    });

    test("Should remove the applied the boundary condition from the deleted point", () => {
      connectionElement = new ConnectionElement(
        "C1",
        [point1, point2],
        ConnectionType.FREE
      );
      const removeCondition = jest.fn();
      point1.removeConditions = removeCondition;

      connectionElement.removePoint(point1);

      expect(removeCondition).toBeCalledTimes(1);
    });
  });

  describe("generateEquilibirum", () => {
    test("Should generate the correct equilibrium equation formatted for the solver", () => {
      setMockProperty(point1, "symbolF_x", "F_P1x+10+2+3");
      setMockProperty(point1, "symbolF_y", "F_P1y+0+1");
      setMockProperty(point1, "symbolM_z", "M_P1z");

      setMockProperty(point2, "symbolF_x", "F_P2x+0+-5");
      setMockProperty(point2, "symbolF_y", "F_P2y+0+-1");
      setMockProperty(point2, "symbolM_z", "0");

      connectionElement = new ConnectionElement(
        "C1",
        [point1, point2],
        ConnectionType.PIN
      );

      const actualEquations = connectionElement.generateEquilibrium();
      const expectedEquations = [
        "1*F_P1x+10+2+3+1*F_P2x+0+-5",
        "1*F_P1y+0+1+1*F_P2y+0+-1",
      ];

      expect(actualEquations).toStrictEqual(expectedEquations);
    });

    test("Should return empty array if there is only 1 point", () => {
      setMockProperty(point1, "symbolF_x", "F_P1x+10+2+3");
      setMockProperty(point1, "symbolF_y", "F_P1y+0+1");
      setMockProperty(point1, "symbolM_z", "M_P1z");

      connectionElement = new ConnectionElement(
        "C1",
        [point1],
        ConnectionType.PIN
      );

      const actualEquations = connectionElement.generateEquilibrium();
      const expectedEquations: string[] = [];

      expect(actualEquations).toStrictEqual(expectedEquations);
    });
  });

  describe("changeConnectionType", () => {
    test("Should reapply the boundary condition of the connection type the point", () => {
      point1.removeConditions = jest.fn();
      point2.removeConditions = jest.fn();
      connectionElement = new ConnectionElement(
        "C1",
        [point1, point2],
        ConnectionType.FREE
      );

      const point3 = new Point("P3", 1, 2);
      connectionElement.addPoint(point3);

      const actualPoint = connectionElement.points[2];

      connectionElement.changeConnectionType(ConnectionType.FIXED);

      expect(actualPoint.symbolF_x).toBe("F_P3x");
      expect(actualPoint.symbolF_y).toBe("F_P3y");
      expect(actualPoint.symbolM_z).toBe("M_P3z");
    });

    test("Should change the type of connection", () => {
      point1.removeConditions = jest.fn();
      point2.removeConditions = jest.fn();
      connectionElement = new ConnectionElement(
        "C1",
        [point1, point2],
        ConnectionType.FREE
      );

      connectionElement.changeConnectionType(ConnectionType.FIXED);

      expect(connectionElement.type).toBe(ConnectionType.FIXED);
    });
  });

  describe("addExternalForce", () => {
    test("Should add a new force to the Connection externalForces", () => {
      connectionElement = new ConnectionElement(
        "C1",
        [point1, point2],
        ConnectionType.FREE
      );

      const force = new ExternalForce("F1", 100, 100);

      connectionElement.addExternalForce(force);

      expect(connectionElement.externalForces.length).toBe(1);
      expect(connectionElement.externalForces[0]).toStrictEqual(force);
    });
  });

  describe("removeExternalForce", () => {
    test("Should remove the correct force from the connection", () => {
      connectionElement = new ConnectionElement(
        "C1",
        [point1, point2],
        ConnectionType.FREE
      );

      const force1 = new ExternalForce("F1", 100, 100);
      const force2 = new ExternalForce("F2", 200, 200);

      connectionElement.addExternalForce(force1);
      connectionElement.addExternalForce(force2);

      connectionElement.removeExternalForce(force1);

      expect(connectionElement.externalForces.length).toBe(1);
      expect(connectionElement.externalForces[0]).toStrictEqual(force2);
    });
  });
});
