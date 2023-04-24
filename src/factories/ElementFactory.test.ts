import { describe, expect, test } from "@jest/globals";
import { ElementFactory } from "./ElementFactory";

describe("ElementFactory", () => {
  describe("getInstance", () => {
    test("Should return the same instance", () => {
      expect(ElementFactory.getInstance()).toEqual(
        ElementFactory.getInstance()
      );
    });
  });
});
