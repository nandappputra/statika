import {
  formatForceForSolver,
  formatMomentForSolver,
} from "../utils/SolverUtils";
import { ExternalForce } from "./ExternalForce";
import { Point } from "./Point";

export class Linkage {
  private _name: string;
  private _externalForces: ExternalForce[];
  private _points: Point[];

  constructor(name: string, p1: Point, p2: Point) {
    this._name = name;
    this._points = [p1, p2];
    this._externalForces = [];
  }

  addExternalForce(externalForce: ExternalForce) {
    this._externalForces.push(externalForce);
  }

  generateEquilibrium(): string[] {
    return [...this.generateForceEquation(), this.generateMomentEquation()];
  }

  get points() {
    return this._points;
  }

  private generateForceEquation() {
    console.log(this._points);
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

  private generateMomentEquation(): string {
    const sigmaM_z: string[] = [];
    const reference = this._points[0];

    this._points.forEach((point) => {
      const diffX = point.x - reference.x;
      const diffY = point.y - reference.y;

      const m1 = formatMomentForSolver(diffY, point.symbolF_x);
      const m2 = formatMomentForSolver(diffX, point.symbolF_y);
      const m3 = formatMomentForSolver(1, point.symbolM_z);

      const equation = `${m1}+-${m2}+${m3}`;
      sigmaM_z.push(equation);
    });

    this._externalForces.forEach((force) => {
      const diffX = force.x - reference.x;
      const diffY = force.y - reference.y;

      const m1 = formatMomentForSolver(diffY, force.symbolF_x);
      const m2 = formatMomentForSolver(diffX, force.symbolF_y);

      const equation = `${m1}+-${m2}`;
      sigmaM_z.push(equation);
    });

    return sigmaM_z.join("+");
  }
}
