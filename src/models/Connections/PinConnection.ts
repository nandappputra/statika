import { Point } from "../Point";
import { Connection } from "./Connection";

export class PinConnection extends Connection {
  constructor(points: Point[]) {
    super(points);
    this._points.forEach((point) => this.applyBoundaryCondition(point));
  }

  addPoint(point: Point): void {
    this.applyBoundaryCondition(point);
    this._points.push(point);
  }

  private applyBoundaryCondition(point: Point) {
    point.M_z = 0;
  }
}
