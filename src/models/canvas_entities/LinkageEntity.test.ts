import { jest, describe, expect, test } from "@jest/globals";
import { MockedObject } from "jest-mock";
import { Linkage } from "../diagram_elements/Linkage";
import { Painter } from "../painters/Painter";
import { LinkageEntity } from "./LinkageEntity";
import { setMockProperty } from "../../utils/TestUtils";
import { ElementType } from "../../utils/Constants";
import { Point } from "../Point";

describe("LinkageEntity", () => {
  let linkage: MockedObject<Linkage>;
  let eventMediator: MockedObject<Painter>;
  let linkageEntity: LinkageEntity;

  beforeEach(() => {
    linkage = jest.createMockFromModule<Linkage>("../diagram_elements/Linkage");
    eventMediator = jest.createMockFromModule<Painter>("../painters/Painter");
  });

  describe("getObjectsToDraw", () => {
    test("Should return an array of Fabric Object with name and type in its data", () => {
      const p1 = new Point("P1", 1, 1);
      const p2 = new Point("P2", 2, 2);
      setMockProperty(linkage, "name", "L1");
      setMockProperty(linkage, "points", [p1, p2]);
      linkageEntity = new LinkageEntity(linkage, eventMediator, undefined);

      const actualObjects = linkageEntity.getObjectsToDraw();
      const expectedObject = {
        name: "L1",
        type: ElementType.LINKAGE,
      };

      expect(actualObjects.length).toBe(1);
      expect(actualObjects[0].data).toStrictEqual(expectedObject);
    });
  });
});
