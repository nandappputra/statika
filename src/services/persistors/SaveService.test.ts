import { describe, expect, test } from "@jest/globals";
import { Painter } from "../../models/painters/Painter";
import { ElementFactory } from "../../factories/ElementFactory";
import { SaveService } from "./SaveService";
import { Structure } from "../../models/Structure";

describe("SaveService", () => {
  describe("buildPngWithMetadata", () => {
    test("Should build a PNG with proper metadata", async () => {
      const painter = jest.createMockFromModule<Painter>(
        "../../models/painters/Painter"
      );
      const elementFactory = jest.createMockFromModule<ElementFactory>(
        "../../factories/ElementFactory"
      );

      painter.toDataURI = jest.fn(
        () =>
          new Promise((resolve) => resolve(generateDataURLWithoutMetadata()))
      );
      painter.buildStructure = jest.fn(() => new Structure([], []));
      elementFactory.getState = jest.fn(() => ({
        linkageCounter: 0,
        connectionCounter: 0,
        externalForceCounter: 0,
        pointCounter: 0,
        idCounter: 0,
      }));

      const saveService = new SaveService(painter, elementFactory);
      const pngDataUri = await saveService.buildPngWithMetadata();

      expect(pngDataUri).toBe(
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAAG3RFWHRmYWN0b3J5AHsiX19lc01vZHVsZSI6dHJ1ZX0gSFg6AAAALHRFWHRzdHJ1Y3R1cmUAeyJfbGlua2FnZXMiOltdLCJfY29ubmVjdGlvbnMiOltdfXtYNFkAAAAGYktHRAD/AP8A/6C9p5MAAADFSURBVHic7cExAQAAAMKg9U9tCF+gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4DW/1AABNfrz/QAAAABJRU5ErkJggg=="
      );
    });
  });
});

const generateDataURLWithoutMetadata = () => {
  return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAABmJLR0QA/wD/AP+gvaeTAAAAxUlEQVR4nO3BMQEAAADCoPVPbQhfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOA1v9QAATX68/0AAAAASUVORK5CYII=";
};
