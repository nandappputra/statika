import { jest, describe, expect, test } from "@jest/globals";
import { MockedObject } from "jest-mock";
import { Linkage } from "../diagram_elements/Linkage";
import { Painter } from "../painters/Painter";
import { LinkageEntity } from "./LinkageEntity";
import { setMockProperty } from "../../utils/TestUtils";
import { ElementType } from "../../utils/Constants";
import { Point } from "../Point";
import { MovePointEvent } from "../Event";

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

  describe("updatePosition", () => {
    test("Should update the position of the icon", () => {
      const p1 = new Point("P1", 1, 1);
      const p2 = new Point("P2", 2, 2);
      setMockProperty(linkage, "name", "L1");
      setMockProperty(linkage, "points", [p1, p2]);
      linkageEntity = new LinkageEntity(linkage, eventMediator, undefined);

      const movePointEvent: MovePointEvent = {
        name: "P1",
        source: "user",
        coordinate: { x: 20, y: 10 },
      };

      linkageEntity.updatePosition(movePointEvent);

      const actualIcon = linkageEntity.getObjectsToDraw()[0];

      expect(actualIcon.points?.[0].x).toBe(20);
      expect(actualIcon.points?.[0].y).toBe(10);
    });

    test("Should throw error when the point is not found within the linkage", () => {
      const p1 = new Point("P1", 1, 1);
      const p2 = new Point("P2", 2, 2);
      setMockProperty(linkage, "name", "L1");
      setMockProperty(linkage, "points", [p1, p2]);
      linkageEntity = new LinkageEntity(linkage, eventMediator, undefined);

      const movePointEvent: MovePointEvent = {
        name: "P3",
        source: "user",
        coordinate: { x: 20, y: 10 },
      };

      expect(() => linkageEntity.updatePosition(movePointEvent)).toThrow(
        "failed to update linkage: missing point"
      );
    });
  });

  describe("addPoint", () => {
    test("Should should increase the number of points in polygon", () => {
      const p1 = new Point("P1", 1, 1);
      const p2 = new Point("P2", 2, 2);
      setMockProperty(linkage, "name", "L1");
      setMockProperty(linkage, "points", [p1, p2]);
      linkage.addPoint = jest.fn();
      linkageEntity = new LinkageEntity(linkage, eventMediator, undefined);

      const p3 = new Point("P3", 3, 3);
      linkageEntity.addPoint(p3);

      const actualIcon = linkageEntity.getObjectsToDraw()[0];

      expect(actualIcon.points?.length).toBe(3);
    });

    test("Should ensure point movement is applied to the correct point", () => {
      const p1 = new Point("P1", 1, 1);
      const p2 = new Point("P2", 2, 2);
      setMockProperty(linkage, "name", "L1");
      setMockProperty(linkage, "points", [p1, p2]);
      linkage.addPoint = jest.fn();
      linkageEntity = new LinkageEntity(linkage, eventMediator, undefined);

      const p3 = new Point("P3", 3, 3);
      linkageEntity.addPoint(p3);

      const movePointEvent: MovePointEvent = {
        name: "P3",
        source: "user",
        coordinate: { x: 20, y: 10 },
      };

      linkageEntity.updatePosition(movePointEvent);

      const actualIcon = linkageEntity.getObjectsToDraw()[0];

      expect(actualIcon.points?.length).toBe(3);

      expect(actualIcon.points?.[0].x).toBe(1);
      expect(actualIcon.points?.[0].y).toBe(1);

      expect(actualIcon.points?.[1].x).toBe(2);
      expect(actualIcon.points?.[1].y).toBe(2);

      expect(actualIcon.points?.[2].x).toBe(20);
      expect(actualIcon.points?.[2].y).toBe(10);
    });
  });
});
