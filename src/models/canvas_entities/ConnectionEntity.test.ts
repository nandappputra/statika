import { jest, describe, expect, test } from "@jest/globals";
import { MockedObject } from "jest-mock";
import { Point } from "../Point";
import { Painter } from "../painters/Painter";
import { ElementType } from "../../utils/Constants";
import { setMockProperty } from "../../utils/TestUtils";
import { Connection } from "../diagram_elements/connections/Connection";
import { ConnectionEntity } from "./ConnectionEntity";
import { MovePointEvent } from "../Event";

describe("ExternalForceEntity", () => {
  let connection: MockedObject<Connection>;
  let eventMediator: MockedObject<Painter>;
  let connectionEntity: ConnectionEntity;

  beforeEach(() => {
    connection = jest.createMockFromModule<Connection>(
      "../diagram_elements/connections/Connection"
    );
    eventMediator = jest.createMockFromModule<Painter>("../painters/Painter");
  });

  describe("getObjectsToDraw", () => {
    test("Should return an array of Fabric Object with name, pointName, and type in its data", () => {
      const p1 = new Point("P1", 1, 1);
      const p2 = new Point("P2", 2, 2);
      setMockProperty(connection, "points", [p1, p2]);
      setMockProperty(connection, "name", "C1");

      connectionEntity = new ConnectionEntity(connection, eventMediator);

      const actualObjects = connectionEntity.getObjectsToDraw();
      const expectedObject = {
        name: "C1",
        pointName: "P1",
        type: ElementType.CONNECTION,
      };

      expect(actualObjects.length).toBe(1);
      expect(actualObjects[0].data).toStrictEqual(expectedObject);
    });
  });

  describe("updatePosition", () => {
    test("Should update the position of the icon", () => {
      const p1 = new Point("P1", 1, 1);
      const p2 = new Point("P2", 2, 2);
      setMockProperty(connection, "points", [p1, p2]);
      setMockProperty(connection, "name", "C1");
      eventMediator.updatePointPosition = jest.fn();

      connectionEntity = new ConnectionEntity(connection, eventMediator);

      const movePointEvent: MovePointEvent = {
        name: "P1",
        source: "user",
        coordinate: { x: 20, y: 10 },
      };

      connectionEntity.updatePosition(movePointEvent);

      const actualObjects = connectionEntity.getObjectsToDraw();

      expect(actualObjects.length).toBe(1);
      expect(actualObjects[0].left).toBe(20);
      expect(actualObjects[0].top).toBe(10);
    });

    test("Should propagate the event to all points in the connection", () => {
      const p1 = new Point("P1", 1, 1);
      const p2 = new Point("P2", 2, 2);
      setMockProperty(connection, "points", [p1, p2]);
      setMockProperty(connection, "name", "C1");
      const updatePosition =
        jest.fn<(movePointEvent: MovePointEvent) => void>();
      eventMediator.updatePointPosition = updatePosition;

      connectionEntity = new ConnectionEntity(connection, eventMediator);

      const movePointEvent: MovePointEvent = {
        name: "P1",
        source: "user",
        coordinate: { x: 20, y: 10 },
      };

      connectionEntity.updatePosition(movePointEvent);

      const expectedPropagatedEvent1: MovePointEvent = {
        name: "P1",
        source: "C1",
        coordinate: { x: 20, y: 10 },
      };
      const expectedPropagatedEvent2: MovePointEvent = {
        name: "P2",
        source: "C1",
        coordinate: { x: 20, y: 10 },
      };

      expect(updatePosition).toBeCalledTimes(2);
      expect(updatePosition).toBeCalledWith(expectedPropagatedEvent1);
      expect(updatePosition).toBeCalledWith(expectedPropagatedEvent2);
    });
  });

  describe("addPoint", () => {
    test("Should add point to the element", () => {
      const p1 = new Point("P1", 1, 1);
      const p2 = new Point("P2", 2, 2);
      const p3 = new Point("P3", 3, 3);
      const addPoint = jest.fn<(point: Point) => void>();
      connection.addPoint = addPoint;
      setMockProperty(connection, "points", [p1, p2]);

      connectionEntity = new ConnectionEntity(connection, eventMediator);

      connectionEntity.addPoint(p3);

      expect(addPoint).toBeCalledTimes(1);
      expect(addPoint).toBeCalledWith(p3);
    });
  });

  describe("deletePoint", () => {
    test("Should remove point from the element", () => {
      const p1 = new Point("P1", 1, 1);
      const p2 = new Point("P2", 2, 2);
      const removePoint = jest.fn<(point: Point) => void>();
      connection.removePoint = removePoint;
      setMockProperty(connection, "points", [p1, p2]);

      connectionEntity = new ConnectionEntity(connection, eventMediator);

      connectionEntity.deletePoint(p2);

      expect(removePoint).toBeCalledTimes(1);
      expect(removePoint).toBeCalledWith(p2);
    });

    test("Should replace the pointName in the metadata with the first point in the element", () => {
      const p1 = new Point("P1", 1, 1);
      const p2 = new Point("P2", 2, 2);
      const p3 = new Point("P3", 3, 3);
      const removePoint = jest.fn<(point: Point) => void>();
      connection.removePoint = removePoint;
      setMockProperty(connection, "points", [p2, p3]);

      connectionEntity = new ConnectionEntity(connection, eventMediator);

      connectionEntity.deletePoint(p1);

      const actualObjects = connectionEntity.getObjectsToDraw();

      expect(actualObjects[0].data?.pointName).toBe("P2");
    });
  });
});
