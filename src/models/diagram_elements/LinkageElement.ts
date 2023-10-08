import {
  formatForceForSolver,
  formatMomentForSolver,
} from "../../utils/SolverUtils";
import { Point } from "./Point";
import { DiagramElement } from "./DiagramElement";

export class LinkageElement implements DiagramElement {
  private _name: string;
  private _id: number;
  private _points: Point[];

  constructor(name: string, id: number, p1: Point, p2: Point) {
    this._name = name;
    this._id = id;
    this._points = [p1, p2];
  }

  generateEquilibrium(): string[] {
    return [...this.generateForceEquation(), this.generateMomentEquation()];
  }

  get points() {
    return this._points;
  }

  private generateForceEquation() {
    const sigmaF_x: string[] = [];
    const sigmaF_y: string[] = [];

    this._points.forEach((point) => {
      sigmaF_x.push(formatForceForSolver(point.symbolF_x));
      sigmaF_y.push(formatForceForSolver(point.symbolF_y));
    });

    return [sigmaF_x.join("+"), sigmaF_y.join("+")];
  }

  private generateMomentEquation(): string {
    const sigmaM_z: string[] = [];
    const reference = this._points[0];

    this._points.forEach((point) => {
      const diffX = point.x - reference.x;
      const diffY = point.y - reference.y;

      const m1 = formatMomentForSolver(diffY, point.symbolF_x, true);
      const m2 = formatMomentForSolver(diffX, point.symbolF_y);
      const m3 = formatMomentForSolver(1, point.symbolM_z);

      const equation = `${m1}+${m2}+${m3}`;
      sigmaM_z.push(equation);
    });

    return sigmaM_z.join("+");
  }

  get name() {
    return this._name;
  }

  get id() {
    return this._id;
  }

  addPoint(point: Point) {
    this._points.push(point);
  }

  removePoint(point: Point) {
    this._points = this._points.filter((data) => data.name !== point.name);
  }

  static fromJson(obj: object, pointMap: Map<number, Point>) {
    if (
      !("_name" in obj && typeof obj._name === "string") ||
      !("_id" in obj && typeof obj._id === "number") ||
      !("_points" in obj && Array.isArray(obj._points))
    ) {
      throw new Error("Invalid JSON for Linkage");
    }

    const points: Point[] = [];

    obj._points.forEach((point: object) => {
      points.push(Point.fromJson(point, pointMap));
    });

    const linkage = new LinkageElement(
      obj._name,
      obj._id,
      points[0],
      points[1]
    );

    if (points.length > 2) {
      for (let i = 2; i < points.length; i++) {
        linkage.addPoint(points[i]);
      }
    }

    return linkage;
  }
}
