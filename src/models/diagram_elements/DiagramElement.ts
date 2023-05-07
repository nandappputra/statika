import { Point } from "./Point";

export interface DiagramElement {
  name: string;
  points: Point[];

  generateEquilibrium(): string[];
  addPoint(point: Point): void;
  removePoint(point: Point): void;
}
