import { describe, expect, test } from "@jest/globals";
import { ElementFactory } from "./ElementFactory";

describe("ElementFactory", () => {
  let factory: ElementFactory;

  beforeAll(() => {
    factory = ElementFactory.getInstance();
  });

  describe("getInstance", () => {
    test("Should return the same instance", () => {
      expect(ElementFactory.getInstance()).toEqual(
        ElementFactory.getInstance()
      );
    });
  });

  describe("buildPoint", () => {
    test("Should return a Point with a name starting with P", () => {
      const point1 = factory.buildPoint({ x: 10, y: 10 });

      expect(point1.name.charAt(0)).toEqual("P");
    });

    test("Should return a Point with a name in increasing order", () => {
      const point2 = factory.buildPoint({ x: 10, y: 10 });

      expect(point2.name.charAt(1)).toEqual("2");
    });
  });
});
