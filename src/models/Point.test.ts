import { describe, expect, test } from "@jest/globals";
import { Point } from "./Point";
import { ExternalForce } from "./ExternalForce";

describe("Point", () => {
  describe("addExternalForce", () => {
    test("Should add external force to the point", () => {
      const point = new Point("P1", 1, 2);
      const force = new ExternalForce("F1", 30, 40);

      point.addExternalForce(force);

      expect(point.externalForces.length).toBe(1);
      expect(point.externalForces[0]).toBe(force);
    });
  });

  describe("removeExternalForce", () => {
    test("Should remove the correct force", () => {
      const point = new Point("P1", 1, 2);
      const force1 = new ExternalForce("F1", 30, 40);
      const force2 = new ExternalForce("F2", 50, 60);

      point.addExternalForce(force1);
      point.addExternalForce(force2);

      point.removeExternalForce(force1);

      expect(point.externalForces.length).toBe(1);
      expect(point.externalForces[0]).toBe(force2);
    });
  });

  describe("symbolF_x", () => {
    test("Should return properly formatted equation that includes external forces", () => {
      const point = new Point("P1", 1, 2);
      const force1 = new ExternalForce("F1", 30, 40);
      const force2 = new ExternalForce("F2", 50, 60);

      point.addExternalForce(force1);
      point.addExternalForce(force2);

      expect(point.symbolF_x).toBe("F_P1x+30+50");
    });
  });

  describe("symbolF_y", () => {
    test("Should return properly formatted equation that includes external forces", () => {
      const point = new Point("P1", 1, 2);
      const force1 = new ExternalForce("F1", 30, 40);
      const force2 = new ExternalForce("F2", 50, 60);

      point.addExternalForce(force1);
      point.addExternalForce(force2);

      expect(point.symbolF_y).toBe("F_P1y+40+60");
    });
  });
});
