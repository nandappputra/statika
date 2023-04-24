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
    test("Should increase the number of points in polygon", () => {
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

    test("Should add the point to the element", () => {
      const p1 = new Point("P1", 1, 1);
      const p2 = new Point("P2", 2, 2);
      setMockProperty(linkage, "name", "L1");
      setMockProperty(linkage, "points", [p1, p2]);
      linkageEntity = new LinkageEntity(linkage, eventMediator, undefined);

      const pointAddition = jest.fn<(point: Point) => void>();
      linkage.addPoint = pointAddition;

      const p3 = new Point("P3", 3, 3);
      linkageEntity.addPoint(p3);

      expect(pointAddition).toBeCalledTimes(1);
      expect(pointAddition).toBeCalledWith(p3);
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

  describe("deletePoint", () => {
    test("Should decrease the number of points in polygon", () => {
      const p1 = new Point("P1", 1, 1);
      const p2 = new Point("P2", 2, 2);
      const p3 = new Point("P3", 2, 2);
      setMockProperty(linkage, "name", "L1");
      setMockProperty(linkage, "points", [p1, p2, p3]);
      linkage.removePoint = jest.fn();
      linkageEntity = new LinkageEntity(linkage, eventMediator, undefined);

      linkageEntity.deletePoint(p3);

      const actualIcon = linkageEntity.getObjectsToDraw()[0];

      expect(actualIcon.points?.length).toBe(2);
    });

    test("Should remove the point from the element", () => {
      const p1 = new Point("P1", 1, 1);
      const p2 = new Point("P2", 2, 2);
      setMockProperty(linkage, "name", "L1");
      setMockProperty(linkage, "points", [p1, p2]);
      linkageEntity = new LinkageEntity(linkage, eventMediator, undefined);

      const pointRemoval = jest.fn<(point: Point) => void>();
      linkage.removePoint = pointRemoval;

      linkageEntity.deletePoint(p1);

      expect(pointRemoval).toBeCalledTimes(1);
      expect(pointRemoval).toBeCalledWith(p1);
    });

    test("Should ensure point movement is applied to the correct point", () => {
      const p1 = new Point("P1", 1, 1);
      const p2 = new Point("P2", 2, 2);
      const p3 = new Point("P3", 2, 2);
      setMockProperty(linkage, "name", "L1");
      setMockProperty(linkage, "points", [p1, p2, p3]);
      linkage.removePoint = jest.fn();
      linkageEntity = new LinkageEntity(linkage, eventMediator, undefined);

      linkageEntity.deletePoint(p1);

      const movePointEvent: MovePointEvent = {
        name: "P3",
        source: "user",
        coordinate: { x: 20, y: 10 },
      };

      linkageEntity.updatePosition(movePointEvent);

      const actualIcon = linkageEntity.getObjectsToDraw()[0];

      expect(actualIcon.points?.length).toBe(2);

      expect(actualIcon.points?.[0].x).toBe(2);
      expect(actualIcon.points?.[0].y).toBe(2);

      expect(actualIcon.points?.[1].x).toBe(20);
      expect(actualIcon.points?.[1].y).toBe(10);
    });

    test("Should throw error if the point is not within the polygon", () => {
      const p1 = new Point("P1", 1, 1);
      const p2 = new Point("P2", 2, 2);
      const p3 = new Point("P3", 2, 2);
      setMockProperty(linkage, "name", "L1");
      setMockProperty(linkage, "points", [p1, p2]);
      linkage.removePoint = jest.fn();
      linkageEntity = new LinkageEntity(linkage, eventMediator, undefined);

      expect(() => linkageEntity.deletePoint(p3)).toThrow(
        "failed to delete point: point not found in polygon"
      );
    });
  });
});
