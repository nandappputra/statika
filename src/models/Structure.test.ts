import { describe, expect, test } from "@jest/globals";
import { LinkageElement } from "./diagram_elements/LinkageElement";
import { ConnectionElement } from "./diagram_elements/ConnectionElement";
import { Structure } from "./Structure";
import { Point } from "./diagram_elements/Point";
import { ConnectionKind } from "../utils/Constants";
import { ExternalForce } from "./diagram_elements/ExternalForce";

describe("Structure", () => {
  describe("generateAllEquilibirum", () => {
    test("Should generate an array with equations from all elements", () => {
      const linkage = jest.createMockFromModule<LinkageElement>(
        "./diagram_elements/LinkageElement"
      );
      linkage.generateEquilibrium = jest.fn(() => [
        "1*F_P1x+0+0+0",
        "1*F_P1y+1*F_P2y+0+100",
        "0*F_P1x+0*F_P1y+0+0+-300*F_P2y+0+0+0+0+-10000+0",
      ]);
      const connection1 = jest.createMockFromModule<ConnectionElement>(
        "./diagram_elements/ConnectionElement"
      );
      connection1.generateEquilibrium = jest.fn(() => ["1*F_P1x", "1*F_P1y"]);
      const connection2 = jest.createMockFromModule<ConnectionElement>(
        "./diagram_elements/ConnectionElement"
      );
      connection2.generateEquilibrium = jest.fn(() => ["0", "1*F_P2y"]);

      const structure = new Structure([linkage], [connection1, connection2]);

      expect(structure.generateAllEquilibirum()).toStrictEqual([
        "1*F_P1x+0+0+0",
        "1*F_P1y+1*F_P2y+0+100",
        "0*F_P1x+0*F_P1y+0+0+-300*F_P2y+0+0+0+0+-10000+0",
        "1*F_P1x",
        "1*F_P1y",
        "0",
        "1*F_P2y",
      ]);
    });
  });

  describe("fromJson", () => {
    test("Should parse a proper Json string", () => {
      const p1 = new Point("p1", 1, 1, 1);
      const p2 = new Point("p2", 2, 2, 2);
      const l1 = new LinkageElement("l1", 3, p1, p2);

      const p3 = new Point("p3", 4, 3, 3);
      const p4 = new Point("p4", 5, 4, 4);
      const l2 = new LinkageElement("l2", 5, p3, p4);

      const c1 = new ConnectionElement("c1", 6, [p2, p3], ConnectionKind.PIN);
      const f1 = new ExternalForce("f1", 7, 1, 1);
      p1.addExternalForce(f1);

      const s1 = new Structure([l1, l2], [c1]);

      const initialStructureString = JSON.stringify(s1);

      const retrievedStructure = Structure.fromJson(
        JSON.parse(initialStructureString) as object
      );
      const retrievedStructureString = JSON.stringify(retrievedStructure);

      expect(retrievedStructureString).toStrictEqual(initialStructureString);
    });
  });
});
