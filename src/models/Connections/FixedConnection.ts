import { Point } from "../Point";
import { Connection } from "./Connection";

export class FixedConnection extends Connection {
  constructor(points: Point[]) {
    super(points);
  }

  addPoint(point: Point): void {
    this._points.push(point);
  }
}
