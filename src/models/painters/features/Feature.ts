import { DiagramElement } from "../../diagram_elements/DiagramElement";
import { Painter } from "../Painter";
import { MovePointEvent } from "../../Event";

export interface Feature {
  handleElementAddition(painter: Painter, element: DiagramElement): void;
  handleElementRemoval(painter: Painter, element: DiagramElement): void;
  handlePointUpdate(painter: Painter, movePointEvent: MovePointEvent): void;
}
