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

  generateEquations(): string[] {
    return [...this.generateForceEquation(), this.generateMomentEquation()];
  }

  private generateForceEquation() {
    const sigmaF_x: string[] = [];
    const sigmaF_y: string[] = [];

    this._points.forEach((point) => {
      sigmaF_x.push(this.formatForceForSolver(point.symbolF_x));
      sigmaF_y.push(this.formatForceForSolver(point.symbolF_y));
    });

    this._externalForces.forEach((force) => {
      sigmaF_x.push(this.formatForceForSolver(force.symbolF_x));
      sigmaF_y.push(this.formatForceForSolver(force.symbolF_y));
    });

    return [sigmaF_x.join("+"), sigmaF_y.join("+")];
  }

  private generateMomentEquation(): string {
    const sigmaM_z: string[] = [];
    const reference = this._points[0];

    this._points.forEach((point) => {
      const diffX = point.x - reference.x;
      const diffY = point.y - reference.y;

      const m1 = this.formatMomentForSolver(diffY, point.symbolF_x);
      const m2 = this.formatMomentForSolver(diffX, point.symbolF_y);
      const m3 = this.formatMomentForSolver(1, point.symbolM_z);

      const equation = `${m1}+-${m2}+${m3}`;
      sigmaM_z.push(equation);
    });

    this._externalForces.forEach((force) => {
      const diffX = force.x - reference.x;
      const diffY = force.y - reference.y;

      const m1 = this.formatMomentForSolver(diffY, force.symbolF_x);
      const m2 = this.formatMomentForSolver(diffX, force.symbolF_y);

      const equation = `${m1}+-${m2}`;
      sigmaM_z.push(equation);
    });

    return sigmaM_z.join("+");
  }

  private formatForceForSolver(force: string) {
    if (Number.isNaN(parseFloat(force))) {
      return `1*${force}`;
    }

    return force;
  }

  private formatMomentForSolver(signedDistance: number, value: string) {
    const valueInNumber = parseFloat(value);
    if (Number.isNaN(valueInNumber)) {
      return `${signedDistance}*${value}`;
    }

    return `${signedDistance * valueInNumber}`;
  }
}
