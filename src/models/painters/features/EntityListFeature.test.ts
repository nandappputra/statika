import { jest, describe, expect, test } from "@jest/globals";
import { EntityListFeature } from "./EntityListFeature";
import { Painter } from "../Painter";
import { LinkageElement } from "../../diagram_elements/LinkageElement";

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
});
