import { describe, expect, test } from "@jest/globals";
import { LinkageElement } from "./diagram_elements/LinkageElement";
import { ConnectionElement } from "./diagram_elements/ConnectionElement";
import { Structure } from "./Structure";

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
});
