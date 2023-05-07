import { jest, describe, expect, test } from "@jest/globals";
import { EntityListFeature } from "./EntityListFeature";
import { Painter } from "../Painter";
import { LinkageElement } from "../../diagram_elements/LinkageElement";
import { Point } from "../../diagram_elements/Point";
import { ExternalForce } from "../../diagram_elements/ExternalForce";

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
      const point = jest.createMockFromModule<Point>(
        "../../diagram_elements/Point"
      );

      entityListFeature.handlePointAddition(painter, element, point);

      expect(setElementList).toBeCalled();
    });
  });

  describe("handlePointRemoval", () => {
    test("Should call update the element list", () => {
      const element = jest.createMockFromModule<LinkageElement>(
        "../../diagram_elements/LinkageElement"
      );
      const point = jest.createMockFromModule<Point>(
        "../../diagram_elements/Point"
      );

      entityListFeature.handlePointRemoval(painter, element, point);

      expect(setElementList).toBeCalled();
    });
  });

  describe("handleForceAddition", () => {
    test("Should call update the element list", () => {
      const element = jest.createMockFromModule<ExternalForce>(
        "../../diagram_elements/ExternalForce"
      );
      const point = jest.createMockFromModule<Point>(
        "../../diagram_elements/Point"
      );

      entityListFeature.handleForceAddition(painter, point, element);

      expect(setElementList).toBeCalled();
    });
  });

  describe("handleForceRemoval", () => {
    test("Should call update the element list", () => {
      const element = jest.createMockFromModule<ExternalForce>(
        "../../diagram_elements/ExternalForce"
      );
      const point = jest.createMockFromModule<Point>(
        "../../diagram_elements/Point"
      );

      entityListFeature.handleForceRemoval(painter, point, element);

      expect(setElementList).toBeCalled();
    });
  });
});
