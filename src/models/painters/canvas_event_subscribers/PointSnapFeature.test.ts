import { jest, describe, expect, test } from "@jest/globals";
import { Painter } from "../Painter";
import { LinkageElement } from "../../diagram_elements/LinkageElement";
import { Point } from "../../diagram_elements/Point";
import { PointSnapFeature } from "./PointSnapFeature";
import { ElementFactory } from "../../../factories/ElementFactory";
import { PointEntity } from "../../canvas_entities/PointEntity";
import { ConnectionKind } from "../../../utils/Constants";
import { ConnectionElement } from "../../diagram_elements/ConnectionElement";
import { DiagramElement } from "../../diagram_elements/DiagramElement";
import { CanvasEntity } from "../../canvas_entities/CanvasEntity";
import { setMockProperty } from "../../../utils/TestUtils";
import { ConnectionEntity } from "../../canvas_entities/ConnectionEntity";
import { fabric } from "fabric";
import { Canvas } from "fabric/fabric-impl";
import { MockedObject } from "jest-mock";

describe("PointSnapFeature", () => {
  let pointSnapFeature: PointSnapFeature;
  let elementFactory: ElementFactory;
  let painter: Painter;
  let canvas: MockedObject<Canvas>;

  beforeEach(() => {
    painter = jest.createMockFromModule<Painter>("../Painter");
    painter.getAllEntityName = jest.fn<() => string[]>();
    elementFactory = jest.createMockFromModule<ElementFactory>(
      "../../../factories/ElementFactory"
    );
    canvas = jest.mocked(new fabric.Canvas(null));

    pointSnapFeature = new PointSnapFeature(elementFactory);
  });

  describe("handleObjectDrop", () => {
    test("Should create a new connection between point and previously added point", () => {
      const point1 = new Point("P1", 1, 10, 10);
      const point2 = new Point("P2", 2, 60, 60);
      const linkage1 = new LinkageElement("L1", 3, point1, point2);
      const point3 = new Point("P3", 4, 63, 63);
      const point4 = new Point("P4", 5, 130, 130);
      const linkage2 = new LinkageElement("L1", 6, point3, point4);
      const pointEntity = new PointEntity(point3, painter, canvas);
      const getPoint = jest.fn((id: number) => {
        switch (id) {
          case 1:
            return point1;
          case 2:
            return point2;
          case 4:
            return point3;
          case 5:
            return point4;
          default:
            throw new Error();
        }
      });
      painter.getPoint = getPoint;
      painter.updatePointPosition = jest.fn();
      painter.setFocus = jest.fn();
      painter.addElement =
        jest.fn<(diagramElement: DiagramElement) => CanvasEntity>();
      const connectionElement = jest.createMockFromModule<ConnectionElement>(
        "../../diagram_elements/ConnectionElement"
      );
      setMockProperty(connectionElement, "name", "test");
      const buildConnection = jest.fn<
        (points: Point[], connectionType: ConnectionKind) => ConnectionElement
      >(() => connectionElement);
      elementFactory.buildConnection = buildConnection;
      pointSnapFeature.handleElementAddition(painter, linkage1);
      pointSnapFeature.handleElementAddition(painter, linkage2);

      pointSnapFeature.handleObjectDrop(painter, {
        id: 4,
        entity: pointEntity,
      });

      expect(buildConnection).toBeCalledTimes(1);
    });

    test("Should add it to exisitng connection instead of creating a new one", () => {
      const point1 = new Point("P1", 1, 10, 10);
      const point2 = new Point("P2", 2, 60, 60);
      const linkage1 = new LinkageElement("L1", 3, point1, point2);
      const point3 = new Point("P3", 4, 63, 63);
      const point4 = new Point("P4", 5, 130, 130);
      const linkage2 = new LinkageElement("L1", 6, point3, point4);
      const pointEntity = new PointEntity(point3, painter, canvas);
      const connection1 = new ConnectionElement(
        "C1",
        7,
        [point2],
        ConnectionKind.FIXED
      );
      const connectionEntity = new ConnectionEntity(connection1, painter, canvas);
      const getPoint = jest.fn((id: number) => {
        switch (id) {
          case 1:
            return point1;
          case 2:
            return point2;
          case 4:
            return point3;
          case 5:
            return point4;
          default:
            throw new Error();
        }
      });
      const addPointToConnection = jest.fn();
      painter.addPointToConnection = addPointToConnection;
      painter.getEntityById = jest.fn((_id: number) => connectionEntity);
      painter.getPoint = getPoint;
      painter.updatePointPosition = jest.fn();
      painter.setFocus = jest.fn();
      painter.addElement =
        jest.fn<(diagramElement: DiagramElement) => CanvasEntity>();
      const connectionElement = jest.createMockFromModule<ConnectionElement>(
        "../../diagram_elements/ConnectionElement"
      );
      setMockProperty(connectionElement, "name", "test");
      const buildConnection = jest.fn<
        (points: Point[], connectionType: ConnectionKind) => ConnectionElement
      >(() => connectionElement);
      elementFactory.buildConnection = buildConnection;
      pointSnapFeature.handleElementAddition(painter, linkage1);
      pointSnapFeature.handleElementAddition(painter, connection1);
      pointSnapFeature.handleElementAddition(painter, linkage2);

      pointSnapFeature.handleObjectDrop(painter, {
        id: 4,
        entity: pointEntity,
      });

      expect(buildConnection).toBeCalledTimes(0);
      expect(addPointToConnection).toBeCalledTimes(1);
    });

    test("Should not connect the dropped point to removed element", () => {
      const point1 = new Point("P1", 1, 10, 10);
      const point2 = new Point("P2", 2, 60, 60);
      const linkage1 = new LinkageElement("L1", 3, point1, point2);
      const point3 = new Point("P3", 4, 63, 63);
      const point4 = new Point("P4", 5, 130, 130);
      const linkage2 = new LinkageElement("L1", 6, point3, point4);
      const pointEntity = new PointEntity(point3, painter, canvas);
      const getPoint = jest.fn((id: number) => {
        switch (id) {
          case 1:
            return point1;
          case 2:
            return point2;
          case 4:
            return point3;
          case 5:
            return point4;
          default:
            throw new Error();
        }
      });
      painter.getPoint = getPoint;
      painter.updatePointPosition = jest.fn();
      painter.setFocus = jest.fn();
      painter.addElement =
        jest.fn<(diagramElement: DiagramElement) => CanvasEntity>();
      const connectionElement = jest.createMockFromModule<ConnectionElement>(
        "../../diagram_elements/ConnectionElement"
      );
      setMockProperty(connectionElement, "name", "test");
      const buildConnection = jest.fn<
        (points: Point[], connectionType: ConnectionKind) => ConnectionElement
      >(() => connectionElement);
      elementFactory.buildConnection = buildConnection;
      pointSnapFeature.handleElementAddition(painter, linkage1);
      pointSnapFeature.handleElementAddition(painter, linkage2);
      pointSnapFeature.handleElementRemoval(painter, linkage1);

      pointSnapFeature.handleObjectDrop(painter, {
        id: 4,
        entity: pointEntity,
      });

      expect(buildConnection).toBeCalledTimes(0);
    });

    test("Should be able to connect the dropped point to a point after connection deletion", () => {
      const point1 = new Point("P1", 1, 10, 10);
      const point2 = new Point("P2", 2, 60, 60);
      const linkage1 = new LinkageElement("L1", 3, point1, point2);
      const point3 = new Point("P3", 4, 63, 63);
      const point4 = new Point("P4", 5, 130, 130);
      const linkage2 = new LinkageElement("L1", 6, point3, point4);
      const pointEntity = new PointEntity(point3, painter, canvas);
      const connection1 = new ConnectionElement(
        "C1",
        7,
        [point2],
        ConnectionKind.FIXED
      );
      const connectionEntity = new ConnectionEntity(connection1, painter, canvas);
      const getPoint = jest.fn((id: number) => {
        switch (id) {
          case 1:
            return point1;
          case 2:
            return point2;
          case 4:
            return point3;
          case 5:
            return point4;
          default:
            throw new Error();
        }
      });
      const addPointToConnection = jest.fn();
      painter.addPointToConnection = addPointToConnection;
      painter.getEntityById = jest.fn((_id: number) => connectionEntity);
      painter.getPoint = getPoint;
      painter.updatePointPosition = jest.fn();
      painter.setFocus = jest.fn();
      painter.addElement =
        jest.fn<(diagramElement: DiagramElement) => CanvasEntity>();
      const connectionElement = jest.createMockFromModule<ConnectionElement>(
        "../../diagram_elements/ConnectionElement"
      );
      setMockProperty(connectionElement, "name", "test");
      const buildConnection = jest.fn<
        (points: Point[], connectionType: ConnectionKind) => ConnectionElement
      >(() => connectionElement);
      elementFactory.buildConnection = buildConnection;
      pointSnapFeature.handleElementAddition(painter, linkage1);
      pointSnapFeature.handleElementAddition(painter, connection1);
      pointSnapFeature.handleElementRemoval(painter, connection1);
      pointSnapFeature.handleElementAddition(painter, linkage2);

      pointSnapFeature.handleObjectDrop(painter, {
        id: 4,
        entity: pointEntity,
      });

      expect(buildConnection).toBeCalledTimes(1);
      expect(addPointToConnection).toBeCalledTimes(0);
    });

    test("Should be able to connect the dropped point to a point after the point is disconnected from connection", () => {
      const point1 = new Point("P1", 1, 10, 10);
      const point2 = new Point("P2", 2, 60, 60);
      const linkage1 = new LinkageElement("L1", 3, point1, point2);
      const point3 = new Point("P3", 4, 63, 63);
      const point4 = new Point("P4", 5, 130, 130);
      const linkage2 = new LinkageElement("L1", 6, point3, point4);
      const pointEntity = new PointEntity(point3, painter, canvas);
      const connection1 = new ConnectionElement(
        "C1",
        7,
        [point2],
        ConnectionKind.FIXED
      );
      const connectionEntity = new ConnectionEntity(connection1, painter, canvas);
      const getPoint = jest.fn((id: number) => {
        switch (id) {
          case 1:
            return point1;
          case 2:
            return point2;
          case 4:
            return point3;
          case 5:
            return point4;
          default:
            throw new Error();
        }
      });
      const addPointToConnection = jest.fn();
      painter.addPointToConnection = addPointToConnection;
      painter.getEntityById = jest.fn((_id: number) => connectionEntity);
      painter.getPoint = getPoint;
      painter.updatePointPosition = jest.fn();
      painter.setFocus = jest.fn();
      painter.addElement =
        jest.fn<(diagramElement: DiagramElement) => CanvasEntity>();
      const connectionElement = jest.createMockFromModule<ConnectionElement>(
        "../../diagram_elements/ConnectionElement"
      );
      setMockProperty(connectionElement, "name", "test");
      const buildConnection = jest.fn<
        (points: Point[], connectionType: ConnectionKind) => ConnectionElement
      >(() => connectionElement);
      elementFactory.buildConnection = buildConnection;
      pointSnapFeature.handleElementAddition(painter, linkage1);
      pointSnapFeature.handleElementAddition(painter, connection1);
      pointSnapFeature.handleElementRemoval(painter, connection1);
      pointSnapFeature.handleElementAddition(painter, linkage2);
      pointSnapFeature.handlePointDisconnection(painter, connection1, point2);

      pointSnapFeature.handleObjectDrop(painter, {
        id: 4,
        entity: pointEntity,
      });

      expect(buildConnection).toBeCalledTimes(1);
      expect(addPointToConnection).toBeCalledTimes(0);
    });

    test("Should create a new connection between point and newly added point to linkage", () => {
      const point1 = new Point("P1", 1, 10, 10);
      const point2 = new Point("P2", 2, 20, 20);
      const linkage1 = new LinkageElement("L1", 3, point1, point2);
      const point3 = new Point("P3", 4, 63, 63);
      const point4 = new Point("P4", 5, 130, 130);
      const linkage2 = new LinkageElement("L1", 6, point3, point4);
      const pointEntity = new PointEntity(point3, painter, canvas);
      const point5 = new Point("P5", 7, 60, 60);
      const getPoint = jest.fn((id: number) => {
        switch (id) {
          case 1:
            return point1;
          case 2:
            return point2;
          case 4:
            return point3;
          case 5:
            return point4;
          case 7:
            return point5;
          default:
            throw new Error();
        }
      });
      painter.getPoint = getPoint;
      painter.updatePointPosition = jest.fn();
      painter.setFocus = jest.fn();
      painter.addElement =
        jest.fn<(diagramElement: DiagramElement) => CanvasEntity>();
      const connectionElement = jest.createMockFromModule<ConnectionElement>(
        "../../diagram_elements/ConnectionElement"
      );
      setMockProperty(connectionElement, "name", "test");
      const buildConnection = jest.fn<
        (points: Point[], connectionType: ConnectionKind) => ConnectionElement
      >(() => connectionElement);
      elementFactory.buildConnection = buildConnection;
      pointSnapFeature.handleElementAddition(painter, linkage1);
      pointSnapFeature.handleElementAddition(painter, linkage2);
      pointSnapFeature.handlePointAddition(painter, linkage1, point5);

      pointSnapFeature.handleObjectDrop(painter, {
        id: 4,
        entity: pointEntity,
      });

      expect(buildConnection).toBeCalledTimes(1);
    });

    test("Should not create a new connection between point and and point that is already removed from linkage", () => {
      const point1 = new Point("P1", 1, 10, 10);
      const point2 = new Point("P2", 2, 20, 20);
      const linkage1 = new LinkageElement("L1", 3, point1, point2);
      const point3 = new Point("P3", 4, 63, 63);
      const point4 = new Point("P4", 5, 130, 130);
      const linkage2 = new LinkageElement("L1", 6, point3, point4);
      const pointEntity = new PointEntity(point3, painter, canvas);
      const getPoint = jest.fn((id: number) => {
        switch (id) {
          case 1:
            return point1;
          case 2:
            return point2;
          case 4:
            return point3;
          case 5:
            return point4;
          default:
            throw new Error();
        }
      });
      painter.getPoint = getPoint;
      painter.updatePointPosition = jest.fn();
      painter.setFocus = jest.fn();
      painter.addElement =
        jest.fn<(diagramElement: DiagramElement) => CanvasEntity>();
      const connectionElement = jest.createMockFromModule<ConnectionElement>(
        "../../diagram_elements/ConnectionElement"
      );
      setMockProperty(connectionElement, "name", "test");
      const buildConnection = jest.fn<
        (points: Point[], connectionType: ConnectionKind) => ConnectionElement
      >(() => connectionElement);
      elementFactory.buildConnection = buildConnection;
      pointSnapFeature.handleElementAddition(painter, linkage1);
      pointSnapFeature.handleElementAddition(painter, linkage2);
      pointSnapFeature.handlePointRemoval(painter, linkage1, point2);

      pointSnapFeature.handleObjectDrop(painter, {
        id: 4,
        entity: pointEntity,
      });

      expect(buildConnection).toBeCalledTimes(0);
    });
  });
});
