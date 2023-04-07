import { Point } from "../Point";

export interface DiagramElement {
  name: string;
  points: Point[];

  generateEquilibrium(): string[];
}
