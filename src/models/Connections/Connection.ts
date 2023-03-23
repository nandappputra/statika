import { Point } from "../Point";

export interface Connection {
  addPoint(point: Point): void;
}
