import { describe, expect, test } from "@jest/globals";
import {
  addMetadataToBase64DataURI,
  getMetadataFromBase64DataURI,
} from "./ImageUtils";

describe("SolverUtils", () => {
  describe("getMetadataFromBase64DataURI", () => {
    test("Should retrieve the correct metadata", () => {
      const pngImage = generateDataURIWithoutMetadata();
      const taggedPng = addMetadataToBase64DataURI(pngImage, "key1", "value1");

      const result = getMetadataFromBase64DataURI(taggedPng, "key1");

      expect(result).toBe("value1");
    });
  });
});

function generateDataURIWithoutMetadata() {
  return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAABmJLR0QA/wD/AP+gvaeTAAAAxUlEQVR4nO3BMQEAAADCoPVPbQhfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOA1v9QAATX68/0AAAAASUVORK5CYII=";
}
