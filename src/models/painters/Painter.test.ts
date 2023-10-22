/**
 * @jest-environment jsdom
 */

import { jest, describe, expect, test } from "@jest/globals";
import { MockedObject } from "jest-mock";
import { LinkageElement } from "../diagram_elements/LinkageElement";
import { Point } from "../diagram_elements/Point";
import { EntityConfig, Painter } from "./Painter";
import { fabric } from "fabric";
import { DiagramElement } from "../diagram_elements/DiagramElement";
import { ConnectionElement } from "../diagram_elements/ConnectionElement";
import { ConnectionKind } from "../../utils/Constants";
import { ExternalForce } from "../diagram_elements/ExternalForce";
import { MovePointEvent } from "../Event";
import { Structure } from "../Structure";
import { ExternalForceEntity } from "../canvas_entities/ExternalForceEntity";
import { CanvasEventSubscriber } from "./canvas_event_subscribers/CanvasEventSubscriber";

describe("Painter", () => {
  let canvas: MockedObject<fabric.Canvas>;
  let eventSubscriber: MockedObject<CanvasEventSubscriber>;
  let entityConfig: MockedObject<EntityConfig>;
  let painter: Painter;

  beforeEach(() => {
    canvas = jest.mocked(new fabric.Canvas(null));
    eventSubscriber = jest.createMockFromModule<CanvasEventSubscriber>(
      "./canvas_event_subscribers/CanvasEventSubscriber"
    );
    entityConfig = jest.createMockFromModule<EntityConfig>("./Painter");

    painter = new Painter(canvas, [eventSubscriber], entityConfig);
  });

  describe("addElement", () => {
    test("Should add the element and the points to the canvas", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const linkage = new LinkageElement("L1", 3, point1, point2);
      const addToCanvas =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.add = addToCanvas;
      eventSubscriber.handleElementAddition = jest.fn();

      painter.addElement(linkage);

      expect(addToCanvas).toBeCalledTimes(3);
      expect(painter.getAllEntityName().length).toBe(3);
    });

    test("Should notify the features about the element addition", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const connection = new ConnectionElement(
        "C1",
        3,
        [point1, point2],
        ConnectionKind.FIXED
      );
      const addToCanvas =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.add = addToCanvas;
      const handleElementAddition =
        jest.fn<(painter: Painter, _element: DiagramElement) => void>();
      eventSubscriber.handleElementAddition = handleElementAddition;

      painter.addElement(connection);

      expect(handleElementAddition).toBeCalledTimes(1);
    });

    test("Should make the pointEntity invisible when adding a connection", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const linkage = new LinkageElement("L1", 3, point1, point2);
      const connection = new ConnectionElement(
        "C1",
        4,
        [point1],
        ConnectionKind.PIN_JOINT
      );
      const addToCanvas =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.add = addToCanvas;
      const handleElementAddition =
        jest.fn<(painter: Painter, _element: DiagramElement) => void>();
      eventSubscriber.handleElementAddition = handleElementAddition;

      painter.addElement(linkage);
      painter.addElement(connection);

      expect(painter.getEntityById(1)?.getObjectsToDraw().visible).toBe(false);
    });

    test("Should add all the external forces when adding a connection", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const linkage = new LinkageElement("L1", 3, point1, point2);
      const connection = new ConnectionElement(
        "C1",
        4,
        [point1],
        ConnectionKind.PIN_JOINT
      );
      const force = new ExternalForce("F1", 5, 1, 2);
      connection.addExternalForce(force);
      const addToCanvas =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.add = addToCanvas;
      const handleElementAddition =
        jest.fn<(painter: Painter, _element: DiagramElement) => void>();
      eventSubscriber.handleElementAddition = handleElementAddition;
      eventSubscriber.handleForceAddition = jest.fn();

      painter.addElement(linkage);
      painter.addElement(connection);

      const expectedEntity = new ExternalForceEntity(
        force,
        connection,
        painter,
        canvas
      );

      expect(painter.getEntityById(5)).toStrictEqual(expectedEntity);
    });

    test("Should not cause duplicate when merging a point with external force", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const linkage = new LinkageElement("L1", 3, point1, point2);
      const force = new ExternalForce("F1", 4, 1, 2);
      point1.addExternalForce(force);
      const connection = new ConnectionElement(
        "C1",
        5,
        [point1],
        ConnectionKind.PIN_JOINT
      );
      const addToCanvas =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.add = addToCanvas;
      const handleElementAddition =
        jest.fn<(painter: Painter, _element: DiagramElement) => void>();
      eventSubscriber.handleElementAddition = handleElementAddition;
      eventSubscriber.handleForceAddition = jest.fn();

      painter.addElement(linkage);
      painter.addElement(connection);

      expect(connection.externalForces.length).toBe(1);
    });
  });

  describe("removeElement", () => {
    test("Should remove the element and the points from the canvas", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const linkage = new LinkageElement("L1", 3, point1, point2);
      const addToCanvas =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.add = addToCanvas;
      const handleElementAddition =
        jest.fn<(painter: Painter, _element: DiagramElement) => void>();
      eventSubscriber.handleElementAddition = handleElementAddition;
      const removeFromCanvas =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.remove = removeFromCanvas;
      const handleElementRemoval =
        jest.fn<(painter: Painter, _element: DiagramElement) => void>();
      eventSubscriber.handleElementRemoval = handleElementRemoval;

      painter.addElement(linkage);

      painter.removeElement(linkage);

      expect(removeFromCanvas).toBeCalledTimes(3);
      expect(painter.getAllEntityName().length).toBe(0);
    });

    test("Should make the pointEntity visible when removing a connection", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const linkage = new LinkageElement("L1", 3, point1, point2);
      const connection = new ConnectionElement(
        "C1",
        4,
        [point1],
        ConnectionKind.PIN_JOINT
      );
      const addToCanvas =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.add = addToCanvas;
      eventSubscriber.handleElementAddition = jest.fn();
      eventSubscriber.handleElementRemoval = jest.fn();
      eventSubscriber.handlePointDisconnection = jest.fn();

      painter.addElement(linkage);
      painter.addElement(connection);
      painter.removeElement(connection);

      expect(painter.getEntityById(1)?.getObjectsToDraw().visible).toBe(true);
    });

    test("Should notify point disconnection when removing a connection", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const linkage = new LinkageElement("L1", 3, point1, point2);
      const connection = new ConnectionElement(
        "C1",
        4,
        [point1, point2],
        ConnectionKind.PIN_JOINT
      );
      canvas.add = jest.fn();
      eventSubscriber.handleElementAddition = jest.fn();
      eventSubscriber.handleElementRemoval = jest.fn();
      const handlePointDisconnection =
        jest.fn<
          (
            _painter: Painter,
            _connection: ConnectionElement,
            _point: Point
          ) => void
        >();
      eventSubscriber.handlePointDisconnection = handlePointDisconnection;
      painter.addElement(linkage);
      painter.addElement(connection);
      painter.removeElement(connection);

      expect(handlePointDisconnection).toBeCalledTimes(2);
      expect(handlePointDisconnection).toBeCalledWith(
        painter,
        connection,
        point1
      );
      expect(handlePointDisconnection).toBeCalledWith(
        painter,
        connection,
        point2
      );
    });

    test("Should remove the boundary condition applied to the point when removing a connection", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const linkage = new LinkageElement("L1", 3, point1, point2);
      const connection = new ConnectionElement(
        "C1",
        4,
        [point1],
        ConnectionKind.PIN_JOINT
      );
      const addToCanvas =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.add = addToCanvas;
      eventSubscriber.handleElementAddition = jest.fn();
      eventSubscriber.handleElementRemoval = jest.fn();
      eventSubscriber.handlePointDisconnection = jest.fn();

      painter.addElement(linkage);
      painter.addElement(connection);
      painter.removeElement(connection);

      expect(point1.symbolM_z).toBe("M_P1z");
    });

    test("Should remove the forces attached to a connection", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const linkage = new LinkageElement("L1", 3, point1, point2);
      const connection = new ConnectionElement(
        "C1",
        4,
        [point1],
        ConnectionKind.PIN_JOINT
      );
      const addToCanvas =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.add = addToCanvas;
      eventSubscriber.handleElementAddition = jest.fn();
      eventSubscriber.handleElementRemoval = jest.fn();
      eventSubscriber.handleForceAddition = jest.fn();
      eventSubscriber.handleForceRemoval = jest.fn();
      eventSubscriber.handlePointDisconnection = jest.fn();

      painter.addElement(linkage);
      painter.addElement(connection);

      const force = new ExternalForce("F1", 5, 1, 2);
      painter.addExternalLoad(connection, force);

      painter.removeElement(connection);

      expect(connection.externalForces.length).toBe(0);
    });

    test("Should notify the feature after actually removing the element", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const linkage = new LinkageElement("L1", 3, point1, point2);
      let numberOfElement = 99;

      canvas.add = jest.fn();
      eventSubscriber.handleElementAddition = jest.fn();
      eventSubscriber.handleElementRemoval = jest.fn(
        (_painter: Painter, _element: DiagramElement) => {
          numberOfElement = painter.getAllEntityName().length;
        }
      );
      eventSubscriber.handlePointDisconnection = jest.fn();

      painter.addElement(linkage);

      painter.removeElement(linkage);

      expect(numberOfElement).toBe(0);
    });
  });

  describe("addExternalLoad", () => {
    test("Should add the force to the point and the canvas", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const linkage = new LinkageElement("L1", 3, point1, point2);
      const addToCanvas =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.add = addToCanvas;
      const handleElementAddition =
        jest.fn<(painter: Painter, _element: DiagramElement) => void>();
      eventSubscriber.handleElementAddition = handleElementAddition;
      const handleForceAddition =
        jest.fn<
          (painter: Painter, point: Point, externalForce: ExternalForce) => void
        >();
      eventSubscriber.handleForceAddition = handleForceAddition;
      painter.addElement(linkage);

      const force = new ExternalForce("F1", 4, 20, 30);

      painter.addExternalLoad(point1, force);

      expect(addToCanvas).toBeCalledTimes(4);
      expect(painter.getAllEntityName().length).toBe(4);
      expect(point1.externalForces.length).toBe(1);
      expect(point1.externalForces[0]).toStrictEqual(force);
    });

    test("Should notify the features about the force addition", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const linkage = new LinkageElement("L1", 3, point1, point2);
      const addToCanvas =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.add = addToCanvas;
      const handleElementAddition =
        jest.fn<(painter: Painter, _element: DiagramElement) => void>();
      eventSubscriber.handleElementAddition = handleElementAddition;
      const handleForceAddition =
        jest.fn<
          (painter: Painter, point: Point, externalForce: ExternalForce) => void
        >();
      eventSubscriber.handleForceAddition = handleForceAddition;
      painter.addElement(linkage);

      const force = new ExternalForce("F1", 4, 20, 30);

      painter.addExternalLoad(point1, force);

      expect(handleForceAddition).toBeCalledTimes(1);
    });
  });

  describe("removeExternalLoad", () => {
    test("Should remove the force from the point and the canvas", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const linkage = new LinkageElement("L1", 3, point1, point2);
      const addToCanvas =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.add = addToCanvas;
      const removeFromCanvas =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.remove = removeFromCanvas;
      const handleElementAddition =
        jest.fn<(painter: Painter, _element: DiagramElement) => void>();
      eventSubscriber.handleElementAddition = handleElementAddition;
      const handleElementRemoval =
        jest.fn<(painter: Painter, _element: DiagramElement) => void>();
      eventSubscriber.handleElementRemoval = handleElementRemoval;
      const handleForceAddition =
        jest.fn<
          (painter: Painter, point: Point, externalForce: ExternalForce) => void
        >();
      eventSubscriber.handleForceAddition = handleForceAddition;
      const handleForceRemoval =
        jest.fn<
          (painter: Painter, point: Point, externalForce: ExternalForce) => void
        >();
      eventSubscriber.handleForceRemoval = handleForceRemoval;
      painter.addElement(linkage);

      const force = new ExternalForce("F1", 4, 20, 30);

      painter.addExternalLoad(point1, force);

      painter.removeExternalLoad(point1, force);

      expect(removeFromCanvas).toBeCalledTimes(1);
      expect(painter.getAllEntityName().length).toBe(3);
      expect(point1.externalForces.length).toBe(0);
    });

    test("Should notify the features about the force removal", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const linkage = new LinkageElement("L1", 3, point1, point2);
      const addToCanvas =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.add = addToCanvas;
      const removeFromCanvas =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.remove = removeFromCanvas;
      const handleElementAddition =
        jest.fn<(painter: Painter, _element: DiagramElement) => void>();
      eventSubscriber.handleElementAddition = handleElementAddition;
      const handleElementRemoval =
        jest.fn<(painter: Painter, _element: DiagramElement) => void>();
      eventSubscriber.handleElementRemoval = handleElementRemoval;
      const handleForceAddition =
        jest.fn<
          (painter: Painter, point: Point, externalForce: ExternalForce) => void
        >();
      eventSubscriber.handleForceAddition = handleForceAddition;
      const handleForceRemoval =
        jest.fn<
          (painter: Painter, point: Point, externalForce: ExternalForce) => void
        >();
      eventSubscriber.handleForceRemoval = handleForceRemoval;
      painter.addElement(linkage);

      const force = new ExternalForce("F1", 4, 20, 30);

      painter.addExternalLoad(point1, force);

      painter.removeExternalLoad(point1, force);

      expect(handleForceRemoval).toBeCalledTimes(1);
    });

    test("Should throw error when the force is not found", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const linkage = new LinkageElement("L1", 3, point1, point2);
      const addToCanvas =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.add = addToCanvas;
      const removeFromCanvas =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.remove = removeFromCanvas;
      const handleElementAddition =
        jest.fn<(painter: Painter, _element: DiagramElement) => void>();
      eventSubscriber.handleElementAddition = handleElementAddition;
      const handleElementRemoval =
        jest.fn<(painter: Painter, _element: DiagramElement) => void>();
      eventSubscriber.handleElementRemoval = handleElementRemoval;
      const handleForceAddition =
        jest.fn<
          (painter: Painter, point: Point, externalForce: ExternalForce) => void
        >();
      eventSubscriber.handleForceAddition = handleForceAddition;
      const handleForceRemoval =
        jest.fn<
          (painter: Painter, point: Point, externalForce: ExternalForce) => void
        >();
      eventSubscriber.handleForceRemoval = handleForceRemoval;
      painter.addElement(linkage);

      const force1 = new ExternalForce("F1", 4, 20, 30);
      const force2 = new ExternalForce("F2", 5, 20, 30);

      painter.addExternalLoad(point1, force1);

      expect(() => painter.removeExternalLoad(point1, force2)).toThrow(
        "failed to remove force: unrecognized force or location"
      );
    });
  });

  describe("addPointToConnection", () => {
    test("Should add the specified point to the connection element", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const connection = new ConnectionElement(
        "C1",
        3,
        [point1, point2],
        ConnectionKind.HORIZONTAL_ROLLER
      );
      const point3 = new Point("P3", 4, 5, 6);
      const point4 = new Point("P4", 5, 7, 8);
      const linkage = new LinkageElement("L1", 6, point3, point4);

      eventSubscriber.handleElementAddition = jest.fn();
      painter.addElement(connection);
      painter.addElement(linkage);

      painter.addPointToConnection(point3, connection);

      expect(connection.points.length).toBe(3);
    });

    test("Should throw error when the connection or point is not found", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const connection = new ConnectionElement(
        "C1",
        3,
        [point1, point2],
        ConnectionKind.HORIZONTAL_ROLLER
      );
      const point3 = new Point("P3", 3, 5, 6);

      expect(() => painter.addPointToConnection(point3, connection)).toThrow(
        "failed to add point to connection: missing or invalid entity"
      );
    });

    test("Should mark the pointEntity as invisible", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const connection = new ConnectionElement(
        "C1",
        3,
        [point1, point2],
        ConnectionKind.HORIZONTAL_ROLLER
      );
      const point3 = new Point("P3", 4, 5, 6);
      const point4 = new Point("P4", 5, 7, 8);
      const linkage = new LinkageElement("L1", 6, point3, point4);

      eventSubscriber.handleElementAddition = jest.fn();
      painter.addElement(connection);
      painter.addElement(linkage);

      painter.addPointToConnection(point3, connection);

      expect(painter.getEntityById(4)?.getObjectsToDraw().visible).toBe(false);
    });

    test("Should move the forces in the point to the connection", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const connection = new ConnectionElement(
        "C1",
        3,
        [point1, point2],
        ConnectionKind.HORIZONTAL_ROLLER
      );
      const point3 = new Point("P3", 4, 5, 6);
      const point4 = new Point("P4", 5, 7, 8);
      const linkage = new LinkageElement("L1", 6, point3, point4);

      const force = new ExternalForce("F1", 7, 1, 2);

      eventSubscriber.handleForceRemoval = jest.fn();
      eventSubscriber.handleForceAddition = jest.fn();
      eventSubscriber.handleElementAddition = jest.fn();
      painter.addElement(connection);
      painter.addElement(linkage);
      painter.addExternalLoad(point3, force);

      painter.addPointToConnection(point3, connection);

      expect(point3.externalForces.length).toBe(0);
      expect(connection.externalForces.length).toBe(1);
      expect(connection.externalForces[0]).toBe(force);
    });
  });

  describe("removePointFromConnection", () => {
    test("Should remove the specified point from the connection element", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const connection = new ConnectionElement(
        "C1",
        3,
        [point1, point2],
        ConnectionKind.HORIZONTAL_ROLLER
      );
      eventSubscriber.handleElementAddition = jest.fn();
      eventSubscriber.handlePointDisconnection = jest.fn();
      painter.addElement(connection);

      painter.removePointFromConnection(point2, connection);

      expect(connection.points.length).toBe(1);
    });

    test("Should throw error when the connection is not found", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const connection = new ConnectionElement(
        "C1",
        3,
        [point1, point2],
        ConnectionKind.HORIZONTAL_ROLLER
      );
      const point3 = new Point("P3", 4, 5, 6);

      expect(() =>
        painter.removePointFromConnection(point3, connection)
      ).toThrow(
        "failed to remove point to connection: missing or invalid entity"
      );
    });

    test("Should notify the features about the point disconnection", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const connection = new ConnectionElement(
        "C1",
        3,
        [point1, point2],
        ConnectionKind.HORIZONTAL_ROLLER
      );
      eventSubscriber.handleElementAddition = jest.fn();
      const handlePointDisconnection =
        jest.fn<
          (
            _painter: Painter,
            _connection: ConnectionElement,
            _point: Point
          ) => void
        >();
      eventSubscriber.handlePointDisconnection = handlePointDisconnection;
      painter.addElement(connection);

      painter.removePointFromConnection(point2, connection);

      expect(handlePointDisconnection).toBeCalledTimes(1);
    });

    test("Should trigger connection deletion when there is no point left", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const connection = new ConnectionElement(
        "C1",
        2,
        [point1],
        ConnectionKind.HORIZONTAL_ROLLER
      );
      eventSubscriber.handleElementAddition = jest.fn();
      eventSubscriber.handleElementRemoval = jest.fn();
      const handlePointDisconnection =
        jest.fn<
          (
            _painter: Painter,
            _connection: ConnectionElement,
            _point: Point
          ) => void
        >();
      eventSubscriber.handlePointDisconnection = handlePointDisconnection;
      painter.addElement(connection);

      painter.removePointFromConnection(point1, connection);

      expect(painter.getAllEntityName.length).toBe(0);
    });

    test("Should mark the pointEntity as visible", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const connection = new ConnectionElement(
        "C1",
        3,
        [point1, point2],
        ConnectionKind.HORIZONTAL_ROLLER
      );
      const point3 = new Point("P3", 4, 5, 6);
      const point4 = new Point("P4", 5, 7, 8);
      const linkage = new LinkageElement("L1", 6, point3, point4);

      eventSubscriber.handleElementAddition = jest.fn();
      painter.addElement(connection);
      painter.addElement(linkage);

      painter.addPointToConnection(point3, connection);

      expect(painter.getEntityById(4)?.getObjectsToDraw().visible).toBe(false);
    });
  });

  describe("addPointToLinkage", () => {
    test("Should add the specified point to the linkage element and canvas", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const linkage = new LinkageElement("L1", 3, point1, point2);

      const addToCanvas =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.add = addToCanvas;
      eventSubscriber.handleElementAddition = jest.fn();
      eventSubscriber.handlePointAddition = jest.fn();
      painter.addElement(linkage);
      const point3 = new Point("P3", 4, 5, 6);

      painter.addPointToLinkage(point3, linkage);

      expect(linkage.points.length).toBe(3);
      expect(addToCanvas).toBeCalledTimes(4);
      expect(painter.getAllEntityName().length).toBe(4);
    });

    test("Should notify the features about the point addition", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const linkage = new LinkageElement("L1", 3, point1, point2);

      eventSubscriber.handleElementAddition = jest.fn();
      const handlePointAddition =
        jest.fn<
          (painter: Painter, _linkage: LinkageElement, _point: Point) => void
        >();
      eventSubscriber.handlePointAddition = handlePointAddition;
      painter.addElement(linkage);
      const point3 = new Point("P3", 4, 5, 6);

      painter.addPointToLinkage(point3, linkage);

      expect(handlePointAddition).toBeCalledTimes(1);
      expect(handlePointAddition).toBeCalledWith(painter, linkage, point3);
    });

    test("Should throw error when the linkage is not found", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const linkage = new LinkageElement("L1", 3, point1, point2);

      const point3 = new Point("P3", 4, 5, 6);

      expect(() => painter.addPointToLinkage(point3, linkage)).toThrow(
        "failed to add point to linkage: missing or invalid entity found"
      );
    });
  });

  describe("removePointFromLinkage", () => {
    test("Should throw error when the point is not found", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const linkage = new LinkageElement("L1", 3, point1, point2);

      eventSubscriber.handleElementAddition = jest.fn();
      painter.addElement(linkage);
      const point3 = new Point("P3", 4, 5, 6);

      expect(() => painter.removePointFromLinkage(point3, linkage)).toThrow(
        "failed to remove point from linkage: unrecognized point"
      );
    });

    test("Should remove the point from the linkage and canvas", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const linkage = new LinkageElement("L1", 3, point1, point2);

      const remove =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.remove = remove;
      eventSubscriber.handleElementAddition = jest.fn();
      eventSubscriber.handlePointAddition = jest.fn();
      eventSubscriber.handlePointRemoval = jest.fn();
      painter.addElement(linkage);

      const point3 = new Point("P3", 4, 5, 6);
      painter.addPointToLinkage(point3, linkage);

      painter.removePointFromLinkage(point2, linkage);

      expect(linkage.points.length).toBe(2);
      expect(painter.getAllEntityName().length).toBe(3);
      expect(remove).toBeCalledTimes(1);
    });

    test("Should notify the feature about the point removal", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const linkage = new LinkageElement("L1", 3, point1, point2);

      const remove =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.remove = remove;
      eventSubscriber.handleElementAddition = jest.fn();
      eventSubscriber.handlePointAddition = jest.fn();
      const handlePointRemoval =
        jest.fn<
          (painter: Painter, _linkage: LinkageElement, _point: Point) => void
        >();
      eventSubscriber.handlePointRemoval = handlePointRemoval;
      painter.addElement(linkage);

      const point3 = new Point("P3", 4, 5, 6);
      painter.addPointToLinkage(point3, linkage);

      painter.removePointFromLinkage(point2, linkage);

      expect(handlePointRemoval).toBeCalledTimes(1);
    });

    test("Should remove the point from the connection if the point is a member of connection", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const linkage = new LinkageElement("L1", 3, point1, point2);

      const remove =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.remove = remove;
      eventSubscriber.handleElementAddition = jest.fn();
      eventSubscriber.handlePointAddition = jest.fn();
      eventSubscriber.handlePointDisconnection = jest.fn();
      const handlePointRemoval =
        jest.fn<
          (painter: Painter, _linkage: LinkageElement, _point: Point) => void
        >();
      eventSubscriber.handlePointRemoval = handlePointRemoval;
      painter.addElement(linkage);

      const point3 = new Point("P3", 4, 5, 6);
      const point4 = new Point("P4", 5, 7, 8);
      const connection = new ConnectionElement(
        "C1",
        6,
        [point3, point4],
        ConnectionKind.HORIZONTAL_ROLLER
      );
      painter.addPointToLinkage(point3, linkage);
      painter.addElement(connection);

      painter.removePointFromLinkage(point3, linkage);

      expect(connection.points.length).toBe(1);
    });

    test("Should remove force that is attached to the point", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const linkage = new LinkageElement("L1", 3, point1, point2);

      const remove =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.remove = remove;
      eventSubscriber.handleElementAddition = jest.fn();
      eventSubscriber.handlePointAddition = jest.fn();
      eventSubscriber.handlePointDisconnection = jest.fn();
      eventSubscriber.handleForceAddition = jest.fn();
      eventSubscriber.handleForceRemoval = jest.fn();
      const handlePointRemoval =
        jest.fn<
          (painter: Painter, _linkage: LinkageElement, _point: Point) => void
        >();
      eventSubscriber.handlePointRemoval = handlePointRemoval;
      painter.addElement(linkage);

      const point3 = new Point("P3", 4, 4, 5);
      painter.addPointToLinkage(point3, linkage);

      const force = new ExternalForce("F1", 5, 100, 100);
      painter.addExternalLoad(point2, force);

      painter.removePointFromLinkage(point2, linkage);

      expect(painter.getAllEntityName().length).toBe(3);
    });

    test("Should remove the linkage if there is only 1 point left", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const linkage = new LinkageElement("L1", 3, point1, point2);

      canvas.remove = jest.fn();
      eventSubscriber.handleElementAddition = jest.fn();
      eventSubscriber.handleElementRemoval = jest.fn();
      eventSubscriber.handlePointRemoval = jest.fn();
      painter.addElement(linkage);

      painter.removePointFromLinkage(point2, linkage);

      expect(painter.getAllEntityName().length).toBe(0);
    });

    test("Should be capable of deleting a connection that is connected to the linkage", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const linkage = new LinkageElement("L1", 3, point1, point2);
      const connection = new ConnectionElement(
        "C1",
        4,
        [point1],
        ConnectionKind.FIXED
      );

      canvas.remove = jest.fn();
      eventSubscriber.handleElementAddition = jest.fn();
      eventSubscriber.handleElementRemoval = jest.fn();
      eventSubscriber.handlePointDisconnection = jest.fn();
      eventSubscriber.handlePointRemoval = jest.fn();
      painter.addElement(linkage);
      painter.addElement(connection);

      painter.removePointFromLinkage(point2, linkage);

      expect(painter.getAllEntityName().length).toBe(0);
    });
  });

  describe("updatePointPosition", () => {
    test("Should update the position of the point", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const linkage = new LinkageElement("L1", 3, point1, point2);

      eventSubscriber.handlePointUpdate = jest.fn();
      eventSubscriber.handleElementAddition = jest.fn();
      eventSubscriber.handlePointUpdate = jest.fn();
      painter.addElement(linkage);

      const movePointEvent: MovePointEvent = {
        id: 1,
        source: 0,
        coordinate: { x: 10, y: 20 },
      };

      painter.updatePointPosition(movePointEvent);

      expect(point1.x).toBe(10);
      expect(point1.y).toBe(20);
    });

    test("Should update the position of the force within that point", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const linkage = new LinkageElement("L1", 3, point1, point2);

      eventSubscriber.handlePointUpdate = jest.fn();
      eventSubscriber.handleElementAddition = jest.fn();
      eventSubscriber.handlePointUpdate = jest.fn();
      eventSubscriber.handleForceAddition = jest.fn();
      painter.addElement(linkage);

      const movePointEvent: MovePointEvent = {
        id: 1,
        source: 0,
        coordinate: { x: 10, y: 20 },
      };

      const force = new ExternalForce("F1", 4, 20, 30);
      painter.addExternalLoad(point1, force);

      painter.updatePointPosition(movePointEvent);

      expect(painter.getEntityById(4)?.getObjectsToDraw().left).toBe(10);
      expect(painter.getEntityById(4)?.getObjectsToDraw().top).toBe(20);
    });

    test("Should notify the subscriber about the update", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const linkage = new LinkageElement("L1", 3, point1, point2);

      const handlePointUpdate =
        jest.fn<(painter: Painter, movePointEvent: MovePointEvent) => void>();
      eventSubscriber.handlePointUpdate = handlePointUpdate;
      eventSubscriber.handleElementAddition = jest.fn();
      painter.addElement(linkage);

      const movePointEvent: MovePointEvent = {
        id: 1,
        source: 0,
        coordinate: { x: 10, y: 20 },
      };

      painter.updatePointPosition(movePointEvent);

      expect(handlePointUpdate).toBeCalledTimes(1);
    });
  });

  describe("setFocus", () => {
    test("Should set the active object of the canvas", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const linkage = new LinkageElement("L1", 3, point1, point2);
      canvas.add = jest.fn();
      eventSubscriber.handleElementAddition = jest.fn();
      const setActiveObject =
        jest.fn<
          (object: fabric.Object, e?: Event | undefined) => fabric.Canvas
        >();
      canvas.setActiveObject = setActiveObject;
      const renderAll = jest.fn<() => fabric.Canvas>();
      canvas.renderAll = renderAll;

      painter.addElement(linkage);

      painter.setFocus(linkage.id);

      expect(setActiveObject).toBeCalledTimes(1);
      expect(renderAll).toBeCalledTimes(1);
    });

    test("Should throw error when the object is not found", () => {
      const point1 = new Point("P1", 1, 1, 2);

      expect(() => painter.setFocus(point1.id)).toThrow(
        "failed to set focus: object not found"
      );
    });
  });

  describe("updateForce", () => {
    test("Should throw error when the force is not found", () => {
      const externalForce = new ExternalForce("F1", 4, 100, 200);

      expect(() => painter.updateForce(externalForce, 20, 20)).toThrow(
        "failed to update force: missing or invalid force"
      );
    });

    test("Should update the components of the force", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const linkage = new LinkageElement("L1", 3, point1, point2);
      canvas.add = jest.fn();
      eventSubscriber.handleElementAddition = jest.fn();
      eventSubscriber.handleForceAddition = jest.fn();
      painter.addElement(linkage);
      const force = new ExternalForce("F1", 4, 20, 30);
      painter.addExternalLoad(point1, force);

      painter.updateForce(force, 1, 2);

      expect(force.symbolF_x).toBe("1");
      expect(force.symbolF_y).toBe("2");
    });
  });

  describe("changeConnectionType", () => {
    test("Should throw error when the connection is not found", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const connection = new ConnectionElement(
        "C1",
        3,
        [point1, point2],
        ConnectionKind.FIXED
      );

      expect(() =>
        painter.changeConnectionType(connection, ConnectionKind.VERTICAL_ROLLER)
      ).toThrow(
        "failed to add change connection type: missing or invalid entity found"
      );
    });

    test("Should change the type of the connection element", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const connection = new ConnectionElement(
        "C1",
        3,
        [point1, point2],
        ConnectionKind.PIN_JOINT
      );
      eventSubscriber.handleElementAddition = jest.fn();

      painter.addElement(connection);

      painter.changeConnectionType(
        connection,
        ConnectionKind.HORIZONTAL_ROLLER
      );

      expect(connection.kind).toBe(ConnectionKind.HORIZONTAL_ROLLER);
    });

    test("Should replace the icon of the connection", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const connection = new ConnectionElement(
        "C1",
        3,
        [point1, point2],
        ConnectionKind.PIN_JOINT
      );
      const add =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.add = add;
      const remove =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.remove = remove;
      eventSubscriber.handleElementAddition = jest.fn();

      painter.addElement(connection);

      const before = painter.getEntityById(3)?.getObjectsToDraw();

      painter.changeConnectionType(
        connection,
        ConnectionKind.HORIZONTAL_ROLLER
      );

      const after = painter.getEntityById(3)?.getObjectsToDraw();

      expect(remove).toBeCalledWith(before);
      expect(add).toBeCalledWith(after);
    });
  });

  describe("buildStructure", () => {
    test("Should build a structure with all the linkages and connection", () => {
      const point1 = new Point("P1", 1, 1, 2);
      const point2 = new Point("P2", 2, 3, 4);
      const linkage = new LinkageElement("L1", 3, point1, point2);
      const connection = new ConnectionElement(
        "C1",
        4,
        [point1],
        ConnectionKind.FIXED
      );

      eventSubscriber.handleElementAddition = jest.fn();
      painter.addElement(linkage);
      painter.addElement(connection);

      const actualStructure = painter.buildStructure();
      const expectedStructure = new Structure([linkage], [connection]);

      expect(actualStructure).toStrictEqual(expectedStructure);
    });
  });
});
