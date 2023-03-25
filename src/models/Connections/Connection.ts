import { formatForceForSolver } from "../../utils/SolverUtils";
import { Point } from "../Point";

export abstract class Connection {
  protected _points: Point[];

  constructor(points: Point[]) {
    this._points = points;
    this._points.forEach((point) => this.applyBoundaryCondition(point));
  }

  abstract applyBoundaryCondition(point: Point): void;

  get points() {
    return this._points;
  }

  generateEquilibrium(): string[] {
    if (this._points.length == 1) {
      return [];
    }

    const sigmaF_x: string[] = [];
    const sigmaF_y: string[] = [];

    this._points.forEach((point) => {
      sigmaF_x.push(formatForceForSolver(point.symbolF_x));
      sigmaF_y.push(formatForceForSolver(point.symbolF_y));
    });

    return [sigmaF_x.join("+"), sigmaF_y.join("+")];
  }
}
