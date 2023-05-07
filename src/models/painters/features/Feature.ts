import { DiagramElement } from "../../diagram_elements/DiagramElement";
import { Painter } from "../Painter";
import { MovePointEvent, objectDropEvent } from "../../Event";
import { Point } from "../../diagram_elements/Point";
import { LinkageElement } from "../../diagram_elements/LinkageElement";
import { ConnectionElement } from "../../diagram_elements/ConnectionElement";
import { ExternalForce } from "../../diagram_elements/ExternalForce";

export interface Feature {
  handleElementAddition(painter: Painter, element: DiagramElement): void;
  handleElementRemoval(painter: Painter, element: DiagramElement): void;
  handlePointUpdate(painter: Painter, movePointEvent: MovePointEvent): void;
  handleObjectDrop(painter: Painter, objectDropEvent: objectDropEvent): void;
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
}
