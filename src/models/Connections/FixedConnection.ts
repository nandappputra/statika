import { Point } from "../Point";
import { Connection } from "./Connection";

export class FixedConnection implements Connection {
  private _points: Point[];

  constructor(points: Point[]) {
    this._points = points;
  }

  addPoint(point: Point): void {
    this._points.push(point);
  }
}
