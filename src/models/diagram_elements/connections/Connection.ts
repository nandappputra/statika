import { Point } from "../../Point";

export interface Connection {
  applyBoundaryCondition(point: Point): void;
}
