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

export interface CanvasEventSubscriber {
  handleElementAddition(painter: Painter, element: DiagramElement): void;
  handleElementRemoval(painter: Painter, element: DiagramElement): void;
  handlePointUpdate(painter: Painter, movePointEvent: MovePointEvent): void;
  handleObjectDrop(painter: Painter, objectDropEvent: ObjectDropEvent): void;
  handlePointAddition(
    painter: Painter,
    linkage: LinkageElement,
    point: Point
  ): void;
  handlePointRemoval(
    painter: Painter,
    linkage: LinkageElement,
    point: Point
  ): void;
  handlePointDisconnection(
    painter: Painter,
    connection: ConnectionElement,
    point: Point
  ): void;
  handleForceAddition(
    painter: Painter,
    location: Point | ConnectionElement,
    externalForce: ExternalForce
  ): void;
  handleForceRemoval(
    painter: Painter,
    location: Point | ConnectionElement,
    externalForce: ExternalForce
  ): void;
  handleObjectSelectionEvent(objectSelectionEvent: ObjectSelectionEvent): void;
  handleObjectSelectionClearEvent(): void;
}
