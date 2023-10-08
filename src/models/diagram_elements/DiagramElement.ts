import { Point } from "./Point";

export interface DiagramElement {
  name: string;
  id: number;
  points: Point[];

  generateEquilibrium(): string[];
  addPoint(point: Point): void;
  removePoint(point: Point): void;
}
