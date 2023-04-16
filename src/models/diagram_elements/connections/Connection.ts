import { formatForceForSolver } from "../../../utils/SolverUtils";
import { ExternalForce } from "../../ExternalForce";
import { Point } from "../../Point";
import { DiagramElement } from "../DiagramElement";

export abstract class Connection implements DiagramElement {
  protected _name: string;
  protected _points: Point[];
  protected _externalForces: ExternalForce[];

  constructor(name: string, points: Point[]) {
    this._name = name;
    this._points = points;
    this._points.forEach((point) => this.applyBoundaryCondition(point));
    this._externalForces = [];
  }

  abstract applyBoundaryCondition(point: Point): void;

  get points() {
    return this._points;
  }

  get name() {
    return this._name;
  }

  addExternalForce(externalForce: ExternalForce) {
    this._externalForces.push(externalForce);
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

    this._externalForces.forEach((force) => {
      sigmaF_x.push(formatForceForSolver(force.symbolF_x));
      sigmaF_y.push(formatForceForSolver(force.symbolF_y));
    });

    return [sigmaF_x.join("+"), sigmaF_y.join("+")];
  }

  public addPoint(point: Point) {
    this.points.push(point);
  }

  public removePoint(deletedPoint: Point) {
    this._points = this.points.filter(
      (point) => point.name !== deletedPoint.name
    );
  }
}
