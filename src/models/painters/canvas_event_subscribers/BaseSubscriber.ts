/* eslint-disable @typescript-eslint/no-empty-function */
import {
  MovePointEvent,
  ObjectDropEvent,
  ObjectSelectionEvent,
} from "../../Event";
import { ConnectionElement } from "../../diagram_elements/ConnectionElement";
import { DiagramElement } from "../../diagram_elements/DiagramElement";
import { ExternalForce } from "../../diagram_elements/ExternalForce";
import { LinkageElement } from "../../diagram_elements/LinkageElement";
import { Point } from "../../diagram_elements/Point";
import { Painter } from "../Painter";
import { CanvasEventSubscriber } from "./CanvasEventSubscriber";

export abstract class BaseSubscriber implements CanvasEventSubscriber {
  handleElementAddition(_painter: Painter, _element: DiagramElement): void {}
  handleElementRemoval(_painter: Painter, _element: DiagramElement): void {}
  handlePointUpdate(_painter: Painter, _movePointEvent: MovePointEvent): void {}
  handleObjectDrop(
    _painter: Painter,
    _objectDropEvent: ObjectDropEvent
  ): void {}
  handlePointAddition(
    _painter: Painter,
    _linkage: LinkageElement,
    _point: Point
  ): void {}
  handlePointRemoval(
    _painter: Painter,
    _linkage: LinkageElement,
    _point: Point
  ): void {}
  handlePointDisconnection(
    _painter: Painter,
    _connection: ConnectionElement,
    _point: Point
  ): void {}
  handleForceAddition(
    _painter: Painter,
    _location: Point | ConnectionElement,
    _externalForce: ExternalForce
  ): void {}
  handleForceRemoval(
    _painter: Painter,
    _location: Point | ConnectionElement,
    _externalForce: ExternalForce
  ): void {}
  handleObjectSelectionEvent(
    _objectSelectionEvent: ObjectSelectionEvent
  ): void {}
  handleObjectSelectionClearEvent(): void {}
}
