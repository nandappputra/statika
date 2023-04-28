import { jest, describe, expect, test } from "@jest/globals";
import { EntityListFeature } from "./EntityListFeature";
import { Painter } from "../Painter";
import { LinkageElement } from "../../diagram_elements/LinkageElement";
import { Point } from "../../Point";

describe("EntityListFeature", () => {
  let entityListFeature: EntityListFeature;
  let setElementList: (elements: string[]) => void;
  let painter: Painter;

  beforeEach(() => {
    painter = jest.createMockFromModule<Painter>("../Painter");
    painter.getAllEntityName = jest.fn<() => string[]>();
    setElementList = jest.fn();

    entityListFeature = new EntityListFeature(setElementList);
  });

  describe("handleElementAddition", () => {
    test("Should call update the element list", () => {
      const element = jest.createMockFromModule<LinkageElement>(
        "../../diagram_elements/LinkageElement"
      );

      entityListFeature.handleElementAddition(painter, element);

      expect(setElementList).toBeCalled();
    });
  });

  describe("handleElementRemoval", () => {
    test("Should call update the element list", () => {
      const element = jest.createMockFromModule<LinkageElement>(
        "../../diagram_elements/LinkageElement"
      );

      entityListFeature.handleElementRemoval(painter, element);

      expect(setElementList).toBeCalled();
    });
  });

  describe("handlePointAddition", () => {
    test("Should call update the element list", () => {
      const element = jest.createMockFromModule<LinkageElement>(
        "../../diagram_elements/LinkageElement"
      );
      const point = jest.createMockFromModule<Point>("../../Point");

      entityListFeature.handlePointAddition(painter, element, point);

      expect(setElementList).toBeCalled();
    });
  });

  describe("handlePointRemoval", () => {
    test("Should call update the element list", () => {
      const element = jest.createMockFromModule<LinkageElement>(
        "../../diagram_elements/LinkageElement"
      );
      const point = jest.createMockFromModule<Point>("../../Point");

      entityListFeature.handlePointRemoval(painter, element, point);

      expect(setElementList).toBeCalled();
    });
  });
});
