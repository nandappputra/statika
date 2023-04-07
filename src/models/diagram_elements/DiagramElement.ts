import { Point } from "../Point";

export interface DiagramElement {
  points: Point[];
  generateEquilibrium(): string[];
}
