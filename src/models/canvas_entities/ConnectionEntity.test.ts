import { jest, describe, expect, test } from "@jest/globals";
import { MockedObject } from "jest-mock";
import { Point } from "../diagram_elements/Point";
import { Painter } from "../painters/Painter";
import { ConnectionKind, EntityPrefix } from "../../utils/Constants";
import { setMockProperty } from "../../utils/TestUtils";
import { ConnectionElement } from "../diagram_elements/ConnectionElement";
import { ConnectionEntity } from "./ConnectionEntity";
import { MovePointEvent } from "../Event";
import { ExternalForce } from "../diagram_elements/ExternalForce";

describe("ConnectionEntity", () => {
  let connection: MockedObject<ConnectionElement>;
  let eventMediator: MockedObject<Painter>;
  let connectionEntity: ConnectionEntity;

  beforeEach(() => {
    connection = jest.createMockFromModule<ConnectionElement>(
      "../diagram_elements/connections/Connection"
    );
    eventMediator = jest.createMockFromModule<Painter>("../painters/Painter");
  });

  describe("getObjectsToDraw", () => {
    test("Should return an array of Fabric Object with name, pointName, and type in its data", () => {
      const p1 = new Point("P1", 1, 1);
      const p2 = new Point("P2", 2, 2);
      setMockProperty(connection, "points", [p1, p2]);
      setMockProperty(connection, "kind", ConnectionKind.VERTICAL_ROLLER);
      setMockProperty(connection, "name", "C1");

      connectionEntity = new ConnectionEntity(connection, eventMediator);

      const actualObjects = connectionEntity.getObjectsToDraw();
      const expectedObject = {
        name: "C1",
        pointName: "P1",
        type: EntityPrefix.CONNECTION,
      };

      expect(actualObjects.data).toStrictEqual(expectedObject);
    });
  });

  describe("updatePosition", () => {
    test("Should update the position of the icon", () => {
      const p1 = new Point("P1", 1, 1);
      const p2 = new Point("P2", 2, 2);
      setMockProperty(connection, "points", [p1, p2]);
      setMockProperty(connection, "name", "C1");
      setMockProperty(connection, "kind", ConnectionKind.HORIZONTAL_ROLLER);
      setMockProperty(connection, "externalForces", []);
      eventMediator.updatePointPosition = jest.fn();

      connectionEntity = new ConnectionEntity(connection, eventMediator);

      const movePointEvent: MovePointEvent = {
        name: "P1",
        source: "user",
        coordinate: { x: 20, y: 10 },
      };

      connectionEntity.updatePosition(movePointEvent);

      const actualObjects = connectionEntity.getObjectsToDraw();

      expect(actualObjects.left).toBe(20);
      expect(actualObjects.top).toBe(10);
    });

    test("Should propagate the event to all points in the connection", () => {
      const p1 = new Point("P1", 1, 1);
      const p2 = new Point("P2", 2, 2);
      setMockProperty(connection, "points", [p1, p2]);
      setMockProperty(connection, "name", "C1");
      setMockProperty(connection, "kind", ConnectionKind.FIXED);
      setMockProperty(connection, "externalForces", []);
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
      const expectedPropagatedEvent3: MovePointEvent = {
        name: "C1",
        source: "C1",
        coordinate: { x: 20, y: 10 },
      };

      expect(updatePosition).toBeCalledTimes(3);
      expect(updatePosition).toBeCalledWith(expectedPropagatedEvent1);
      expect(updatePosition).toBeCalledWith(expectedPropagatedEvent2);
      expect(updatePosition).toBeCalledWith(expectedPropagatedEvent3);
    });

    test("Should propagate the event to all external forces in the connection", () => {
      const p1 = new Point("P1", 1, 1);
      const p2 = new Point("P2", 2, 2);
      const f1 = new ExternalForce("F1", 3, 3);
      setMockProperty(connection, "points", [p1, p2]);
      setMockProperty(connection, "name", "C1");
      setMockProperty(connection, "kind", ConnectionKind.FIXED);
      setMockProperty(connection, "externalForces", [f1]);
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
      const expectedPropagatedEvent3: MovePointEvent = {
        name: "C1",
        source: "C1",
        coordinate: { x: 20, y: 10 },
      };

      expect(updatePosition).toBeCalledTimes(3);
      expect(updatePosition).toBeCalledWith(expectedPropagatedEvent1);
      expect(updatePosition).toBeCalledWith(expectedPropagatedEvent2);
      expect(updatePosition).toBeCalledWith(expectedPropagatedEvent3);
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
      setMockProperty(connection, "kind", ConnectionKind.PIN_JOINT);
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
      setMockProperty(connection, "kind", ConnectionKind.PIN_JOINT);
      setMockProperty(connection, "points", [p2, p3]);

      connectionEntity = new ConnectionEntity(connection, eventMediator);

      connectionEntity.deletePoint(p1);

      const actualObjects = connectionEntity.getObjectsToDraw();

      expect(actualObjects.data?.pointName).toBe("P2");
    });
  });

  describe("addExternalForce", () => {
    test("Should add external force to the element", () => {
      const p1 = new Point("P1", 1, 1);
      const p2 = new Point("P2", 2, 2);
      const addExternalForce =
        jest.fn<(externalForce: ExternalForce) => void>();
      connection.addExternalForce = addExternalForce;
      setMockProperty(connection, "points", [p1, p2]);

      connectionEntity = new ConnectionEntity(connection, eventMediator);

      const force = new ExternalForce("F1", 1, 2);
      connectionEntity.addExternalForce(force);

      expect(addExternalForce).toBeCalledTimes(1);
      expect(addExternalForce).toBeCalledWith(force);
    });
  });

  describe("addExternalForce", () => {
    test("Should add external force to the element", () => {
      const p1 = new Point("P1", 1, 1);
      const p2 = new Point("P2", 2, 2);
      const addExternalForce =
        jest.fn<(externalForce: ExternalForce) => void>();
      connection.addExternalForce = addExternalForce;
      setMockProperty(connection, "points", [p1, p2]);

      connectionEntity = new ConnectionEntity(connection, eventMediator);

      const force = new ExternalForce("F1", 1, 2);
      connectionEntity.addExternalForce(force);

      expect(addExternalForce).toBeCalledTimes(1);
      expect(addExternalForce).toBeCalledWith(force);
    });
  });

  describe("removeExternalForce", () => {
    test("Should remove external force from the element", () => {
      const p1 = new Point("P1", 1, 1);
      const p2 = new Point("P2", 2, 2);
      connection.addExternalForce = jest.fn();
      const removeExternalForce =
        jest.fn<(externalForce: ExternalForce) => void>();
      connection.removeExternalForce = removeExternalForce;
      setMockProperty(connection, "points", [p1, p2]);

      connectionEntity = new ConnectionEntity(connection, eventMediator);

      const force = new ExternalForce("F1", 1, 2);
      connectionEntity.addExternalForce(force);
      connectionEntity.removeExternalForce(force);

      expect(removeExternalForce).toBeCalledTimes(1);
      expect(removeExternalForce).toBeCalledWith(force);
    });
  });

  describe("changeConnectionType", () => {
    test("Should change objects to be drawn", () => {
      const p1 = new Point("P1", 1, 1);
      const p2 = new Point("P2", 2, 2);
      setMockProperty(connection, "points", [p1, p2]);
      setMockProperty(connection, "name", "C1");
      setMockProperty(connection, "kind", ConnectionKind.HORIZONTAL_ROLLER);
      connection.changeConnectionType = jest.fn();
      connectionEntity = new ConnectionEntity(connection, eventMediator);

      const initialIcon = connectionEntity.getObjectsToDraw();

      connectionEntity.changeConnectionType(ConnectionKind.VERTICAL_ROLLER);

      const finalIcon = connectionEntity.getObjectsToDraw();

      expect(finalIcon).not.toEqual(initialIcon);
    });

    test("Should update the connection type for the element", () => {
      const p1 = new Point("P1", 1, 1);
      const p2 = new Point("P2", 2, 2);
      setMockProperty(connection, "points", [p1, p2]);
      setMockProperty(connection, "name", "C1");
      setMockProperty(connection, "kind", ConnectionKind.PIN_JOINT);
      const changeConnectionType =
        jest.fn<(connectionType: ConnectionKind) => void>();
      connection.changeConnectionType = changeConnectionType;
      connectionEntity = new ConnectionEntity(connection, eventMediator);

      connectionEntity.getObjectsToDraw();

      connectionEntity.changeConnectionType(ConnectionKind.FIXED);

      connectionEntity.getObjectsToDraw();

      expect(changeConnectionType).toBeCalledWith(ConnectionKind.FIXED);
    });
  });
});
