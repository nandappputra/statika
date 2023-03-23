import { Point } from "./Point";

export class Linkage {
  private _name: string;
  private _start: Point;
  private _end: Point;

  constructor(name: string, start: Point, end: Point) {
    this._name = name;
    this._start = start;
    this._end = end;
  }
}
