import { Point } from "../Point";
import { Connection } from "./Connection";

export class FreeConnection extends Connection {
  constructor(points: Point[]) {
    super(points);
    this._points.forEach((point) => this.applyBoundaryCondition(point));
  }

  addPoint(point: Point): void {
    this.applyBoundaryCondition(point);
    this._points.push(point);
  }

  private applyBoundaryCondition(point: Point) {
    point.F_x = 0;
    point.F_y = 0;
    point.M_z = 0;
  }
}
