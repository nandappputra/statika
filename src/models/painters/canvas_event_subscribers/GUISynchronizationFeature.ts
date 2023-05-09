import { MovePointEvent, ObjectSelectionEvent } from "../../Event";
import { ConnectionElement } from "../../diagram_elements/ConnectionElement";
import { DiagramElement } from "../../diagram_elements/DiagramElement";
import { ExternalForce } from "../../diagram_elements/ExternalForce";
import { LinkageElement } from "../../diagram_elements/LinkageElement";
import { Point } from "../../diagram_elements/Point";
import { Painter } from "../Painter";
import { BaseSubscriber } from "./BaseSubscriber";

export class GUISynchronizationFeature extends BaseSubscriber {
  private _movePointEventCallback: (movePointEvent: MovePointEvent) => void;
  private _objectSelectionEventCallback: (
    objectSelectionEvent: ObjectSelectionEvent
  ) => void;
  private _objectSelectionClearEventCallback: () => void;
  private _elementAdditionCallback: (
    painter: Painter,
    element: DiagramElement
  ) => void;
  private _elementRemovalCallback: (
    painter: Painter,
    _element: DiagramElement
  ) => void;
  private _pointAdditionCallback: (
    painter: Painter,
    linkage: LinkageElement,
    point: Point
  ) => void;
  private _pointRemovalCallback: (
    painter: Painter,
    linkage: LinkageElement,
    point: Point
  ) => void;
  private _forceAdditionCallback: (
    painter: Painter,
    location: Point | ConnectionElement,
    externalForce: ExternalForce
  ) => void;
  private _forceRemovalCallback: (
    painter: Painter,
    location: Point | ConnectionElement,
    externalForce: ExternalForce
  ) => void;

  constructor(
    movePointEventCallback: (movePointEvent: MovePointEvent) => void,
    objectSelectionEventCallback: (
      objectSelectionEvent: ObjectSelectionEvent
    ) => void,
    objectSelectionClearCallback: () => void,
    elementAdditionCallback: (
      painter: Painter,
      element: DiagramElement
    ) => void,
    elementRemovalCallback: (painter: Painter, element: DiagramElement) => void,
    pointAdditionCallback: (
      painter: Painter,
      linkage: LinkageElement,
      point: Point
    ) => void,
    pointRemovalCallback: (
      painter: Painter,
      linkage: LinkageElement,
      point: Point
    ) => void,
    forceAdditionCallback: (
      painter: Painter,
      location: Point | ConnectionElement,
      externalForce: ExternalForce
    ) => void,
    forceRemovalCallback: (
      painter: Painter,
      location: Point | ConnectionElement,
      externalForce: ExternalForce
    ) => void
  ) {
    super();
    this._movePointEventCallback = movePointEventCallback;
    this._objectSelectionEventCallback = objectSelectionEventCallback;
    this._objectSelectionClearEventCallback = objectSelectionClearCallback;
    this._elementAdditionCallback = elementAdditionCallback;
    this._elementRemovalCallback = elementRemovalCallback;
    this._pointAdditionCallback = pointAdditionCallback;
    this._pointRemovalCallback = pointRemovalCallback;
    this._forceAdditionCallback = forceAdditionCallback;
    this._forceRemovalCallback = forceRemovalCallback;
  }

  override handlePointUpdate(
    _painter: Painter,
    movePointEvent: MovePointEvent
  ): void {
    this._movePointEventCallback(movePointEvent);
  }

  override handleObjectSelectionEvent(
    objectSelectionEvent: ObjectSelectionEvent
  ): void {
    this._objectSelectionEventCallback(objectSelectionEvent);
  }

  override handleObjectSelectionClearEvent(): void {
    this._objectSelectionClearEventCallback();
  }

  override handleElementAddition(
    painter: Painter,
    element: DiagramElement
  ): void {
    this._elementAdditionCallback(painter, element);
  }

  override handleElementRemoval(
    painter: Painter,
    element: DiagramElement
  ): void {
    this._elementRemovalCallback(painter, element);
  }

  override handlePointAddition(
    painter: Painter,
    linkage: LinkageElement,
    point: Point
  ): void {
    this._pointAdditionCallback(painter, linkage, point);
  }

  override handlePointRemoval(
    painter: Painter,
    linkage: LinkageElement,
    point: Point
  ): void {
    this._pointRemovalCallback(painter, linkage, point);
  }

  override handleForceAddition(
    painter: Painter,
    location: ConnectionElement | Point,
    externalForce: ExternalForce
  ): void {
    this._forceAdditionCallback(painter, location, externalForce);
  }

  override handleForceRemoval(
    painter: Painter,
    location: ConnectionElement | Point,
    externalForce: ExternalForce
  ): void {
    this._forceRemovalCallback(painter, location, externalForce);
  }
}
