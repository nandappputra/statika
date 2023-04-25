import { DiagramElement } from "../../diagram_elements/DiagramElement";
import { Painter } from "../Painter";
import { MovePointEvent, objectDropEvent } from "../../Event";
import { Point } from "../../Point";
import { LinkageElement } from "../../diagram_elements/LinkageElement";
import { Connection } from "../../diagram_elements/connections/Connection";
import { ExternalForce } from "../../ExternalForce";

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
    connection: Connection,
    point: Point
  ): void;
  handleForceAddition(
    painter: Painter,
    point: Point,
    externalForce: ExternalForce
  ): void;
  handleForceRemoval(
    painter: Painter,
    point: Point,
    externalForce: ExternalForce
  ): void;
}
