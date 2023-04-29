import { jest, describe, expect, test } from "@jest/globals";
import { MockedObject } from "jest-mock";
import { LinkageElement } from "../diagram_elements/LinkageElement";
import { Point } from "../Point";
import { EntityConfig, Painter } from "./Painter";
import { EventTrigger } from "./EventTrigger";
import { EntityListFeature } from "./features/EntityListFeature";
import { fabric } from "fabric";
import { DiagramElement } from "../diagram_elements/DiagramElement";
import { ConnectionElement } from "../diagram_elements/ConnectionElement";
import { ConnectionType } from "../../utils/Constants";
import { ExternalForce } from "../ExternalForce";
import { MovePointEvent } from "../Event";

describe("Painter", () => {
  let canvas: MockedObject<fabric.Canvas>;
  let eventSubscriber: MockedObject<EventTrigger>;
  let feature: MockedObject<EntityListFeature>;
  let entityConfig: MockedObject<EntityConfig>;
  let painter: Painter;

  beforeEach(() => {
    canvas = jest.mocked(new fabric.Canvas(null));
    eventSubscriber = jest.createMockFromModule<EventTrigger>("./EventTrigger");
    feature = jest.createMockFromModule<EntityListFeature>(
      "./features/EntityListFeature"
    );
    entityConfig = jest.createMockFromModule<EntityConfig>("./Painter");

    painter = new Painter(canvas, [eventSubscriber], [feature], entityConfig);
  });

  describe("addElement", () => {
    test("Should add the element and the points to the canvas", () => {
      const point1 = new Point("P1", 1, 2);
      const point2 = new Point("P2", 3, 4);
      const linkage = new LinkageElement("L1", point1, point2);
      const addToCanvas =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.add = addToCanvas;
      const handleElementAddition =
        jest.fn<(painter: Painter, _element: DiagramElement) => void>();
      feature.handleElementAddition = handleElementAddition;

      painter.addElement(linkage);

      expect(addToCanvas).toBeCalledTimes(3);
      expect(painter.getAllEntityName().length).toBe(3);
    });

    test("Should notify the features about the element addition", () => {
      const point1 = new Point("P1", 1, 2);
      const point2 = new Point("P2", 3, 4);
      const connection = new ConnectionElement(
        "C1",
        [point1, point2],
        ConnectionType.FIXED
      );
      const addToCanvas =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.add = addToCanvas;
      const handleElementAddition =
        jest.fn<(painter: Painter, _element: DiagramElement) => void>();
      feature.handleElementAddition = handleElementAddition;

      painter.addElement(connection);

      expect(handleElementAddition).toBeCalledTimes(1);
    });

    test("Should make the pointEntity invisible when adding a connection", () => {
      const point1 = new Point("P1", 1, 2);
      const point2 = new Point("P2", 3, 4);
      const linkage = new LinkageElement("L1", point1, point2);
      const connection = new ConnectionElement(
        "C1",
        [point1],
        ConnectionType.PIN
      );
      const addToCanvas =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.add = addToCanvas;
      const handleElementAddition =
        jest.fn<(painter: Painter, _element: DiagramElement) => void>();
      feature.handleElementAddition = handleElementAddition;

      painter.addElement(linkage);
      painter.addElement(connection);

      expect(painter.getEntityByName("P1")?.getObjectsToDraw().visible).toBe(
        false
      );
    });
  });

  describe("removeElement", () => {
    test("Should remove the element and the points from the canvas", () => {
      const point1 = new Point("P1", 1, 2);
      const point2 = new Point("P2", 3, 4);
      const linkage = new LinkageElement("L1", point1, point2);
      const addToCanvas =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.add = addToCanvas;
      const handleElementAddition =
        jest.fn<(painter: Painter, _element: DiagramElement) => void>();
      feature.handleElementAddition = handleElementAddition;
      const removeFromCanvas =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.remove = removeFromCanvas;
      const handleElementRemoval =
        jest.fn<(painter: Painter, _element: DiagramElement) => void>();
      feature.handleElementRemoval = handleElementRemoval;

      painter.addElement(linkage);

      painter.removeElement(linkage);

      expect(removeFromCanvas).toBeCalledTimes(3);
      expect(painter.getAllEntityName().length).toBe(0);
    });

    test("Should notify the features about the element addition", () => {
      const point1 = new Point("P1", 1, 2);
      const point2 = new Point("P2", 3, 4);
      const linkage = new LinkageElement("L1", point1, point2);
      const addToCanvas =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.add = addToCanvas;
      const handleElementAddition =
        jest.fn<(painter: Painter, _element: DiagramElement) => void>();
      feature.handleElementAddition = handleElementAddition;
      const removeFromCanvas =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.remove = removeFromCanvas;
      const handleElementRemoval =
        jest.fn<(painter: Painter, _element: DiagramElement) => void>();
      feature.handleElementRemoval = handleElementRemoval;

      painter.addElement(linkage);

      painter.removeElement(linkage);

      expect(handleElementRemoval).toBeCalledTimes(1);
    });

    test("Should make the pointEntity visible when removing a connection", () => {
      const point1 = new Point("P1", 1, 2);
      const point2 = new Point("P2", 3, 4);
      const linkage = new LinkageElement("L1", point1, point2);
      const connection = new ConnectionElement(
        "C1",
        [point1],
        ConnectionType.PIN
      );
      const addToCanvas =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.add = addToCanvas;
      feature.handleElementAddition = jest.fn();
      feature.handleElementRemoval = jest.fn();

      painter.addElement(linkage);
      painter.addElement(connection);
      painter.removeElement(connection);

      expect(painter.getEntityByName("P1")?.getObjectsToDraw().visible).toBe(
        true
      );
    });
  });

  describe("addExternalLoad", () => {
    test("Should add the force to the point and the canvas", () => {
      const point1 = new Point("P1", 1, 2);
      const point2 = new Point("P2", 3, 4);
      const linkage = new LinkageElement("L1", point1, point2);
      const addToCanvas =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.add = addToCanvas;
      const handleElementAddition =
        jest.fn<(painter: Painter, _element: DiagramElement) => void>();
      feature.handleElementAddition = handleElementAddition;
      const handleForceAddition =
        jest.fn<
          (painter: Painter, point: Point, externalForce: ExternalForce) => void
        >();
      feature.handleForceAddition = handleForceAddition;
      painter.addElement(linkage);

      const force = new ExternalForce("F1", 20, 30);

      painter.addExternalLoad(point1, force);

      expect(addToCanvas).toBeCalledTimes(4);
      expect(painter.getAllEntityName().length).toBe(4);
      expect(point1.externalForces.length).toBe(1);
      expect(point1.externalForces[0]).toStrictEqual(force);
    });

    test("Should notify the features about the force addition", () => {
      const point1 = new Point("P1", 1, 2);
      const point2 = new Point("P2", 3, 4);
      const linkage = new LinkageElement("L1", point1, point2);
      const addToCanvas =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.add = addToCanvas;
      const handleElementAddition =
        jest.fn<(painter: Painter, _element: DiagramElement) => void>();
      feature.handleElementAddition = handleElementAddition;
      const handleForceAddition =
        jest.fn<
          (painter: Painter, point: Point, externalForce: ExternalForce) => void
        >();
      feature.handleForceAddition = handleForceAddition;
      painter.addElement(linkage);

      const force = new ExternalForce("F1", 20, 30);

      painter.addExternalLoad(point1, force);

      expect(handleForceAddition).toBeCalledTimes(1);
    });
  });

  describe("removeExternalLoad", () => {
    test("Should remove the force from the point and the canvas", () => {
      const point1 = new Point("P1", 1, 2);
      const point2 = new Point("P2", 3, 4);
      const linkage = new LinkageElement("L1", point1, point2);
      const addToCanvas =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.add = addToCanvas;
      const removeFromCanvas =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.remove = removeFromCanvas;
      const handleElementAddition =
        jest.fn<(painter: Painter, _element: DiagramElement) => void>();
      feature.handleElementAddition = handleElementAddition;
      const handleElementRemoval =
        jest.fn<(painter: Painter, _element: DiagramElement) => void>();
      feature.handleElementRemoval = handleElementRemoval;
      const handleForceAddition =
        jest.fn<
          (painter: Painter, point: Point, externalForce: ExternalForce) => void
        >();
      feature.handleForceAddition = handleForceAddition;
      const handleForceRemoval =
        jest.fn<
          (painter: Painter, point: Point, externalForce: ExternalForce) => void
        >();
      feature.handleForceRemoval = handleForceRemoval;
      painter.addElement(linkage);

      const force = new ExternalForce("F1", 20, 30);

      painter.addExternalLoad(point1, force);

      painter.removeExternalLoad(point1, force);

      expect(removeFromCanvas).toBeCalledTimes(1);
      expect(painter.getAllEntityName().length).toBe(3);
      expect(point1.externalForces.length).toBe(0);
    });

    test("Should notify the features about the force removal", () => {
      const point1 = new Point("P1", 1, 2);
      const point2 = new Point("P2", 3, 4);
      const linkage = new LinkageElement("L1", point1, point2);
      const addToCanvas =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.add = addToCanvas;
      const removeFromCanvas =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.remove = removeFromCanvas;
      const handleElementAddition =
        jest.fn<(painter: Painter, _element: DiagramElement) => void>();
      feature.handleElementAddition = handleElementAddition;
      const handleElementRemoval =
        jest.fn<(painter: Painter, _element: DiagramElement) => void>();
      feature.handleElementRemoval = handleElementRemoval;
      const handleForceAddition =
        jest.fn<
          (painter: Painter, point: Point, externalForce: ExternalForce) => void
        >();
      feature.handleForceAddition = handleForceAddition;
      const handleForceRemoval =
        jest.fn<
          (painter: Painter, point: Point, externalForce: ExternalForce) => void
        >();
      feature.handleForceRemoval = handleForceRemoval;
      painter.addElement(linkage);

      const force = new ExternalForce("F1", 20, 30);

      painter.addExternalLoad(point1, force);

      painter.removeExternalLoad(point1, force);

      expect(handleForceRemoval).toBeCalledTimes(1);
    });

    test("Should throw error when the force is not found", () => {
      const point1 = new Point("P1", 1, 2);
      const point2 = new Point("P2", 3, 4);
      const linkage = new LinkageElement("L1", point1, point2);
      const addToCanvas =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.add = addToCanvas;
      const removeFromCanvas =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.remove = removeFromCanvas;
      const handleElementAddition =
        jest.fn<(painter: Painter, _element: DiagramElement) => void>();
      feature.handleElementAddition = handleElementAddition;
      const handleElementRemoval =
        jest.fn<(painter: Painter, _element: DiagramElement) => void>();
      feature.handleElementRemoval = handleElementRemoval;
      const handleForceAddition =
        jest.fn<
          (painter: Painter, point: Point, externalForce: ExternalForce) => void
        >();
      feature.handleForceAddition = handleForceAddition;
      const handleForceRemoval =
        jest.fn<
          (painter: Painter, point: Point, externalForce: ExternalForce) => void
        >();
      feature.handleForceRemoval = handleForceRemoval;
      painter.addElement(linkage);

      const force1 = new ExternalForce("F1", 20, 30);
      const force2 = new ExternalForce("F2", 20, 30);

      painter.addExternalLoad(point1, force1);

      expect(() => painter.removeExternalLoad(point1, force2)).toThrow(
        "failed to remove force: unrecognized force or location"
      );
    });
  });

  describe("addPointToConnection", () => {
    test("Should add the specified point to the connection element", () => {
      const point1 = new Point("P1", 1, 2);
      const point2 = new Point("P2", 3, 4);
      const connection = new ConnectionElement(
        "C1",
        [point1, point2],
        ConnectionType.HORIZONTAL_ROLLER
      );
      const point3 = new Point("P3", 5, 6);
      const point4 = new Point("P4", 7, 8);
      const linkage = new LinkageElement("L1", point3, point4);

      feature.handleElementAddition = jest.fn();
      painter.addElement(connection);
      painter.addElement(linkage);

      painter.addPointToConnection(point3, connection);

      expect(connection.points.length).toBe(3);
    });

    test("Should throw error when the connection or point is not found", () => {
      const point1 = new Point("P1", 1, 2);
      const point2 = new Point("P2", 3, 4);
      const connection = new ConnectionElement(
        "C1",
        [point1, point2],
        ConnectionType.HORIZONTAL_ROLLER
      );
      const point3 = new Point("P3", 5, 6);

      expect(() => painter.addPointToConnection(point3, connection)).toThrow(
        "failed to add point to connection: missing or invalid entity"
      );
    });

    test("Should mark the pointEntity as invisible", () => {
      const point1 = new Point("P1", 1, 2);
      const point2 = new Point("P2", 3, 4);
      const connection = new ConnectionElement(
        "C1",
        [point1, point2],
        ConnectionType.HORIZONTAL_ROLLER
      );
      const point3 = new Point("P3", 5, 6);
      const point4 = new Point("P4", 7, 8);
      const linkage = new LinkageElement("L1", point3, point4);

      feature.handleElementAddition = jest.fn();
      painter.addElement(connection);
      painter.addElement(linkage);

      painter.addPointToConnection(point3, connection);

      expect(painter.getEntityByName("P3")?.getObjectsToDraw().visible).toBe(
        false
      );
    });
  });

  describe("removePointFromConnection", () => {
    test("Should remove the specified point from the connection element", () => {
      const point1 = new Point("P1", 1, 2);
      const point2 = new Point("P2", 3, 4);
      const connection = new ConnectionElement(
        "C1",
        [point1, point2],
        ConnectionType.HORIZONTAL_ROLLER
      );
      feature.handleElementAddition = jest.fn();
      feature.handlePointDisconnection = jest.fn();
      painter.addElement(connection);

      painter.removePointFromConnection(point2, connection);

      expect(connection.points.length).toBe(1);
    });

    test("Should throw error when the connection is not found", () => {
      const point1 = new Point("P1", 1, 2);
      const point2 = new Point("P2", 3, 4);
      const connection = new ConnectionElement(
        "C1",
        [point1, point2],
        ConnectionType.HORIZONTAL_ROLLER
      );
      const point3 = new Point("P3", 5, 6);

      expect(() =>
        painter.removePointFromConnection(point3, connection)
      ).toThrow("failed to add point to connection: missing or invalid entity");
    });

    test("Should notify the features about the point disconnection", () => {
      const point1 = new Point("P1", 1, 2);
      const point2 = new Point("P2", 3, 4);
      const connection = new ConnectionElement(
        "C1",
        [point1, point2],
        ConnectionType.HORIZONTAL_ROLLER
      );
      feature.handleElementAddition = jest.fn();
      const handlePointDisconnection =
        jest.fn<
          (
            _painter: Painter,
            _connection: ConnectionElement,
            _point: Point
          ) => void
        >();
      feature.handlePointDisconnection = handlePointDisconnection;
      painter.addElement(connection);

      painter.removePointFromConnection(point2, connection);

      expect(handlePointDisconnection).toBeCalledTimes(1);
    });

    test("Should trigger connection deletion when there is no point left", () => {
      const point1 = new Point("P1", 1, 2);
      const connection = new ConnectionElement(
        "C1",
        [point1],
        ConnectionType.HORIZONTAL_ROLLER
      );
      feature.handleElementAddition = jest.fn();
      feature.handleElementRemoval = jest.fn();
      const handlePointDisconnection =
        jest.fn<
          (
            _painter: Painter,
            _connection: ConnectionElement,
            _point: Point
          ) => void
        >();
      feature.handlePointDisconnection = handlePointDisconnection;
      painter.addElement(connection);

      painter.removePointFromConnection(point1, connection);

      expect(painter.getAllEntityName.length).toBe(0);
    });
  });

  describe("addPointToLinkage", () => {
    test("Should add the specified point to the linkage element and canvas", () => {
      const point1 = new Point("P1", 1, 2);
      const point2 = new Point("P2", 3, 4);
      const linkage = new LinkageElement("L1", point1, point2);

      const addToCanvas =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.add = addToCanvas;
      feature.handleElementAddition = jest.fn();
      feature.handlePointAddition = jest.fn();
      painter.addElement(linkage);
      const point3 = new Point("P3", 5, 6);

      painter.addPointToLinkage(point3, linkage);

      expect(linkage.points.length).toBe(3);
      expect(addToCanvas).toBeCalledTimes(4);
      expect(painter.getAllEntityName().length).toBe(4);
    });

    test("Should notify the features about the point addition", () => {
      const point1 = new Point("P1", 1, 2);
      const point2 = new Point("P2", 3, 4);
      const linkage = new LinkageElement("L1", point1, point2);

      feature.handleElementAddition = jest.fn();
      const handlePointAddition =
        jest.fn<
          (painter: Painter, _linkage: LinkageElement, _point: Point) => void
        >();
      feature.handlePointAddition = handlePointAddition;
      painter.addElement(linkage);
      const point3 = new Point("P3", 5, 6);

      painter.addPointToLinkage(point3, linkage);

      expect(handlePointAddition).toBeCalledTimes(1);
      expect(handlePointAddition).toBeCalledWith(painter, linkage, point3);
    });

    test("Should throw error when the linkage is not found", () => {
      const point1 = new Point("P1", 1, 2);
      const point2 = new Point("P2", 3, 4);
      const linkage = new LinkageElement("L1", point1, point2);

      const point3 = new Point("P3", 5, 6);

      expect(() => painter.addPointToLinkage(point3, linkage)).toThrow(
        "failed to add point to linkage: missing or invalid entity found"
      );
    });
  });

  describe("removePointFromLinkage", () => {
    test("Should throw error when the point is not found", () => {
      const point1 = new Point("P1", 1, 2);
      const point2 = new Point("P2", 3, 4);
      const linkage = new LinkageElement("L1", point1, point2);

      feature.handleElementAddition = jest.fn();
      painter.addElement(linkage);
      const point3 = new Point("P3", 5, 6);

      expect(() => painter.removePointFromLinkage(point3, linkage)).toThrow(
        "failed to remove point from linkage: unrecognized point"
      );
    });

    test("Should remove the point from the linkage and canvas", () => {
      const point1 = new Point("P1", 1, 2);
      const point2 = new Point("P2", 3, 4);
      const linkage = new LinkageElement("L1", point1, point2);

      const remove =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.remove = remove;
      feature.handleElementAddition = jest.fn();
      feature.handlePointAddition = jest.fn();
      feature.handlePointRemoval = jest.fn();
      painter.addElement(linkage);

      const point3 = new Point("P3", 5, 6);
      painter.addPointToLinkage(point3, linkage);

      painter.removePointFromLinkage(point2, linkage);

      expect(linkage.points.length).toBe(2);
      expect(painter.getAllEntityName().length).toBe(3);
      expect(remove).toBeCalledTimes(1);
    });

    test("Should notify the feature about the point removal", () => {
      const point1 = new Point("P1", 1, 2);
      const point2 = new Point("P2", 3, 4);
      const linkage = new LinkageElement("L1", point1, point2);

      const remove =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.remove = remove;
      feature.handleElementAddition = jest.fn();
      feature.handlePointAddition = jest.fn();
      const handlePointRemoval =
        jest.fn<
          (painter: Painter, _linkage: LinkageElement, _point: Point) => void
        >();
      feature.handlePointRemoval = handlePointRemoval;
      painter.addElement(linkage);

      const point3 = new Point("P3", 5, 6);
      painter.addPointToLinkage(point3, linkage);

      painter.removePointFromLinkage(point2, linkage);

      expect(handlePointRemoval).toBeCalledTimes(1);
    });
  });

  test("Should remove the point from the connection if the point is a member of connection", () => {
    const point1 = new Point("P1", 1, 2);
    const point2 = new Point("P2", 3, 4);
    const linkage = new LinkageElement("L1", point1, point2);

    const remove =
      jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
    canvas.remove = remove;
    feature.handleElementAddition = jest.fn();
    feature.handlePointAddition = jest.fn();
    feature.handlePointDisconnection = jest.fn();
    const handlePointRemoval =
      jest.fn<
        (painter: Painter, _linkage: LinkageElement, _point: Point) => void
      >();
    feature.handlePointRemoval = handlePointRemoval;
    painter.addElement(linkage);

    const point3 = new Point("P3", 5, 6);
    const point4 = new Point("P4", 7, 8);
    const connection = new ConnectionElement(
      "C1",
      [point3, point4],
      ConnectionType.HORIZONTAL_ROLLER
    );
    painter.addPointToLinkage(point3, linkage);
    painter.addElement(connection);

    painter.removePointFromLinkage(point3, linkage);

    expect(connection.points.length).toBe(1);
  });

  test("Should remove force that is attached to the point", () => {
    const point1 = new Point("P1", 1, 2);
    const point2 = new Point("P2", 3, 4);
    const linkage = new LinkageElement("L1", point1, point2);

    const remove =
      jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
    canvas.remove = remove;
    feature.handleElementAddition = jest.fn();
    feature.handlePointAddition = jest.fn();
    feature.handlePointDisconnection = jest.fn();
    feature.handleForceAddition = jest.fn();
    feature.handleForceRemoval = jest.fn();
    const handlePointRemoval =
      jest.fn<
        (painter: Painter, _linkage: LinkageElement, _point: Point) => void
      >();
    feature.handlePointRemoval = handlePointRemoval;
    painter.addElement(linkage);

    const point3 = new Point("P3", 4, 5);
    painter.addPointToLinkage(point3, linkage);

    const force = new ExternalForce("F1", 100, 100);
    painter.addExternalLoad(point2, force);

    painter.removePointFromLinkage(point2, linkage);

    expect(painter.getAllEntityName().length).toBe(3);
  });

  test("Should remove the linkage if there is only 1 point left", () => {
    const point1 = new Point("P1", 1, 2);
    const point2 = new Point("P2", 3, 4);
    const linkage = new LinkageElement("L1", point1, point2);

    canvas.remove = jest.fn();
    feature.handleElementAddition = jest.fn();
    feature.handleElementRemoval = jest.fn();
    feature.handlePointRemoval = jest.fn();
    painter.addElement(linkage);

    painter.removePointFromLinkage(point2, linkage);

    expect(painter.getAllEntityName().length).toBe(0);
  });

  describe("updatePointPosition", () => {
    test("Should throw error when the point is not found", () => {
      feature.handleElementAddition = jest.fn();

      const movePointEvent: MovePointEvent = {
        name: "P4",
        source: "user",
        coordinate: { x: 10, y: 10 },
      };

      expect(() => painter.updatePointPosition(movePointEvent)).toThrow(
        "failed to update point position: missing point"
      );
    });

    test("Should update the position of the point", () => {
      const point1 = new Point("P1", 1, 2);
      const point2 = new Point("P2", 3, 4);
      const linkage = new LinkageElement("L1", point1, point2);

      eventSubscriber.notifyMovePointEvent = jest.fn();
      feature.handleElementAddition = jest.fn();
      feature.handlePointUpdate = jest.fn();
      painter.addElement(linkage);

      const movePointEvent: MovePointEvent = {
        name: "P1",
        source: "user",
        coordinate: { x: 10, y: 20 },
      };

      painter.updatePointPosition(movePointEvent);

      expect(point1.x).toBe(10);
      expect(point1.y).toBe(20);
    });

    test("Should update the position of the force within that point", () => {
      const point1 = new Point("P1", 1, 2);
      const point2 = new Point("P2", 3, 4);
      const linkage = new LinkageElement("L1", point1, point2);

      eventSubscriber.notifyMovePointEvent = jest.fn();
      feature.handleElementAddition = jest.fn();
      feature.handlePointUpdate = jest.fn();
      feature.handleForceAddition = jest.fn();
      painter.addElement(linkage);

      const movePointEvent: MovePointEvent = {
        name: "P1",
        source: "user",
        coordinate: { x: 10, y: 20 },
      };

      const force = new ExternalForce("F1", 20, 30);
      painter.addExternalLoad(point1, force);

      painter.updatePointPosition(movePointEvent);

      expect(painter.getEntityByName("F1")?.getObjectsToDraw().left).toBe(10);
      expect(painter.getEntityByName("F1")?.getObjectsToDraw().top).toBe(20);
    });

    test("Should notify the subscriber and the feature about the update", () => {
      const point1 = new Point("P1", 1, 2);
      const point2 = new Point("P2", 3, 4);
      const linkage = new LinkageElement("L1", point1, point2);

      const notifyMovePointEvent =
        jest.fn<(movePointEvent: MovePointEvent) => void>();
      eventSubscriber.notifyMovePointEvent = notifyMovePointEvent;
      feature.handleElementAddition = jest.fn();
      const handlePointUpdate =
        jest.fn<(_painter: Painter, _movePointEvent: MovePointEvent) => void>();
      feature.handlePointUpdate = handlePointUpdate;
      painter.addElement(linkage);

      const movePointEvent: MovePointEvent = {
        name: "P1",
        source: "user",
        coordinate: { x: 10, y: 20 },
      };

      painter.updatePointPosition(movePointEvent);

      expect(notifyMovePointEvent).toBeCalledTimes(1);
      expect(handlePointUpdate).toBeCalledTimes(1);
    });
  });

  describe("setFocus", () => {
    test("Should set the active object of the canvas", () => {
      const point1 = new Point("P1", 1, 2);
      const point2 = new Point("P2", 3, 4);
      const linkage = new LinkageElement("L1", point1, point2);
      canvas.add = jest.fn();
      feature.handleElementAddition = jest.fn();
      const setActiveObject =
        jest.fn<
          (object: fabric.Object, e?: Event | undefined) => fabric.Canvas
        >();
      canvas.setActiveObject = setActiveObject;
      const renderAll = jest.fn<() => fabric.Canvas>();
      canvas.renderAll = renderAll;

      painter.addElement(linkage);

      painter.setFocus(linkage.name);

      expect(setActiveObject).toBeCalledTimes(1);
      expect(renderAll).toBeCalledTimes(1);
    });

    test("Should throw error when the object is not found", () => {
      const point1 = new Point("P1", 1, 2);

      expect(() => painter.setFocus(point1.name)).toThrow(
        "failed to set focus: object not found"
      );
    });
  });

  describe("updateForce", () => {
    test("Should throw error when the force is not found", () => {
      const externalForce = new ExternalForce("F1", 100, 200);

      expect(() => painter.updateForce(externalForce, 20, 20)).toThrow(
        "failed to update force: missing or invalid force"
      );
    });

    test("Should update the components of the force", () => {
      const point1 = new Point("P1", 1, 2);
      const point2 = new Point("P2", 3, 4);
      const linkage = new LinkageElement("L1", point1, point2);
      canvas.add = jest.fn();
      feature.handleElementAddition = jest.fn();
      feature.handleForceAddition = jest.fn();
      painter.addElement(linkage);
      const force = new ExternalForce("F1", 20, 30);
      painter.addExternalLoad(point1, force);

      painter.updateForce(force, 1, 2);

      expect(force.symbolF_x).toBe("1");
      expect(force.symbolF_y).toBe("2");
    });
  });

  describe("changeConnectionType", () => {
    test("Should throw error when the connection is not found", () => {
      const point1 = new Point("P1", 1, 2);
      const point2 = new Point("P2", 3, 4);
      const connection = new ConnectionElement(
        "C1",
        [point1, point2],
        ConnectionType.FIXED
      );

      expect(() =>
        painter.changeConnectionType(connection, ConnectionType.FREE)
      ).toThrow(
        "failed to add change connection type: missing or invalid entity found"
      );
    });

    test("Should change the type of the connection element", () => {
      const point1 = new Point("P1", 1, 2);
      const point2 = new Point("P2", 3, 4);
      const connection = new ConnectionElement(
        "C1",
        [point1, point2],
        ConnectionType.PIN
      );
      feature.handleElementAddition = jest.fn();

      painter.addElement(connection);

      painter.changeConnectionType(
        connection,
        ConnectionType.HORIZONTAL_ROLLER
      );

      expect(connection.type).toBe(ConnectionType.HORIZONTAL_ROLLER);
    });

    test("Should replace the icon of the connection", () => {
      const point1 = new Point("P1", 1, 2);
      const point2 = new Point("P2", 3, 4);
      const connection = new ConnectionElement(
        "C1",
        [point1, point2],
        ConnectionType.PIN
      );
      const add =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.add = add;
      const remove =
        jest.fn<(...object: fabric.Object[]) => fabric.StaticCanvas>();
      canvas.remove = remove;
      feature.handleElementAddition = jest.fn();

      painter.addElement(connection);

      const before = painter.getEntityByName("C1")?.getObjectsToDraw();

      painter.changeConnectionType(
        connection,
        ConnectionType.HORIZONTAL_ROLLER
      );

      const after = painter.getEntityByName("C1")?.getObjectsToDraw();

      expect(remove).toBeCalledWith(before);
      expect(add).toBeCalledWith(after);
    });
  });
});
