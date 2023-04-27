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

      feature.handleElementAddition = jest.fn();
      painter.addElement(connection);
      const point3 = new Point("P3", 5, 6);

      painter.addPointToConnection(point3, connection);

      expect(connection.points.length).toBe(3);
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

      expect(() => painter.addPointToConnection(point3, connection)).toThrow(
        "failed to add point to connection: missing or invalid entity"
      );
    });
  });
});
