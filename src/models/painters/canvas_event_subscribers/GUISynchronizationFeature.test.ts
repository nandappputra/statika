import { jest, describe, expect, test } from "@jest/globals";
import { GUISynchronizationFeature } from "./GUISynchronizationFeature";
import { Painter } from "../Painter";
import { LinkageElement } from "../../diagram_elements/LinkageElement";
import { Point } from "../../diagram_elements/Point";
import { ExternalForce } from "../../diagram_elements/ExternalForce";
import { MovePointEvent, ObjectSelectionEvent } from "../../Event";
import { DiagramElement } from "../../diagram_elements/DiagramElement";
import { ConnectionElement } from "../../diagram_elements/ConnectionElement";

describe("GUISynchronizationFeature", () => {
  let guiSynchronizationFeature: GUISynchronizationFeature;
  const painter = jest.createMockFromModule<Painter>("../Painter");
  const element = jest.createMockFromModule<LinkageElement>(
    "../../diagram_elements/LinkageElement"
  );
  const point = jest.createMockFromModule<Point>(
    "../../diagram_elements/Point"
  );
  const linkage = jest.createMockFromModule<LinkageElement>(
    "../../diagram_elements/LinkageElement"
  );
  const externalForce = jest.createMockFromModule<ExternalForce>(
    "../../diagram_elements/ExternalForce"
  );

  const movePointEvent =
    jest.createMockFromModule<MovePointEvent>("../../Event");
  const objectSelectionEvent =
    jest.createMockFromModule<ObjectSelectionEvent>("../../Event");

  let movePointEventCallback: (movePointEvent: MovePointEvent) => void;
  let objectSelectionEventCallback: (
    objectSelectionEvent: ObjectSelectionEvent
  ) => void;
  let objectSelectionClearEventCallback: () => void;
  let elementAdditionCallback: (
    painter: Painter,
    element: DiagramElement
  ) => void;
  let elementRemovalCallback: (
    painter: Painter,
    element: DiagramElement
  ) => void;
  let pointAdditionCallback: (
    painter: Painter,
    linkage: LinkageElement,
    point: Point
  ) => void;
  let pointRemovalCallback: (
    painter: Painter,
    linkage: LinkageElement,
    point: Point
  ) => void;
  let forceAdditionCallback: (
    painter: Painter,
    location: Point | ConnectionElement,
    externalForce: ExternalForce
  ) => void;
  let forceRemovalCallback: (
    painter: Painter,
    location: Point | ConnectionElement,
    externalForce: ExternalForce
  ) => void;

  beforeEach(() => {
    movePointEventCallback = jest.fn();
    objectSelectionEventCallback = jest.fn();
    objectSelectionClearEventCallback = jest.fn();
    elementAdditionCallback = jest.fn();
    elementRemovalCallback = jest.fn();
    pointAdditionCallback = jest.fn();
    pointRemovalCallback = jest.fn();
    forceAdditionCallback = jest.fn();
    forceRemovalCallback = jest.fn();

    guiSynchronizationFeature = new GUISynchronizationFeature(
      movePointEventCallback,
      objectSelectionEventCallback,
      objectSelectionClearEventCallback,
      elementAdditionCallback,
      elementRemovalCallback,
      pointAdditionCallback,
      pointRemovalCallback,
      forceAdditionCallback,
      forceRemovalCallback
    );
  });

  describe("handlePointUpdate", () => {
    test("Should call theassigned callback function", () => {
      guiSynchronizationFeature.handlePointUpdate(painter, movePointEvent);

      expect(movePointEventCallback).toBeCalled();
    });
  });

  describe("handleObjectSelectionEvent", () => {
    test("Should call theassigned callback function", () => {
      guiSynchronizationFeature.handleObjectSelectionEvent(
        objectSelectionEvent
      );

      expect(objectSelectionEventCallback).toBeCalled();
    });
  });

  describe("handleObjectSelectionClearEvent", () => {
    test("Should call theassigned callback function", () => {
      guiSynchronizationFeature.handleObjectSelectionClearEvent();

      expect(objectSelectionClearEventCallback).toBeCalled();
    });
  });

  describe("handleElementAddition", () => {
    test("Should call theassigned callback function", () => {
      guiSynchronizationFeature.handleElementAddition(painter, element);

      expect(elementAdditionCallback).toBeCalled();
    });
  });

  describe("handleElementRemoval", () => {
    test("Should call theassigned callback function", () => {
      guiSynchronizationFeature.handleElementRemoval(painter, element);

      expect(elementRemovalCallback).toBeCalled();
    });
  });

  describe("handlePointAddition", () => {
    test("Should call theassigned callback function", () => {
      guiSynchronizationFeature.handlePointAddition(painter, linkage, point);

      expect(pointAdditionCallback).toBeCalled();
    });
  });

  describe("handlePointRemoval", () => {
    test("Should call theassigned callback function", () => {
      guiSynchronizationFeature.handlePointRemoval(painter, linkage, point);

      expect(pointRemovalCallback).toBeCalled();
    });
  });

  describe("handleForceAddition", () => {
    test("Should call theassigned callback function", () => {
      guiSynchronizationFeature.handleForceAddition(
        painter,
        point,
        externalForce
      );

      expect(forceAdditionCallback).toBeCalled();
    });
  });

  describe("handleForceRemoval", () => {
    test("Should call theassigned callback function", () => {
      guiSynchronizationFeature.handleForceRemoval(
        painter,
        point,
        externalForce
      );

      expect(forceRemovalCallback).toBeCalled();
    });
  });
});
