import { DiagramElement } from "../../diagram_elements/DiagramElement";
import { Painter } from "../Painter";
import { MovePointEvent, objectDropEvent } from "../../Event";
import { Point } from "../../Point";
import { Linkage } from "../../diagram_elements/Linkage";

export interface Feature {
  handleElementAddition(painter: Painter, element: DiagramElement): void;
  handleElementRemoval(painter: Painter, element: DiagramElement): void;
  handlePointUpdate(painter: Painter, movePointEvent: MovePointEvent): void;
  handleObjectDrop(painter: Painter, objectDropEvent: objectDropEvent): void;
  handlePointAddition(painter: Painter, linkage: Linkage, point: Point): void;
  handlePointRemoval(painter: Painter, linkage: Linkage, point: Point): void;
}
