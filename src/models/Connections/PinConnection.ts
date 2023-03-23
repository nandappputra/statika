import { Point } from "../Point";
import { Connection } from "./Connection";

export class PinConnection implements Connection {
  private _points: Point[];

  constructor(points: Point[]) {
    this._points = points;
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
