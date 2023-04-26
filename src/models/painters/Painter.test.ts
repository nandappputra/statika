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
});
