import { ExternalForce } from "./ExternalForce";
import { Variable } from "../Variable";

export class Point {
  private _name: string;
  private _id: number;
  private _positionX: number;
  private _positionY: number;
  private _externalForces: ExternalForce[];

  private _F_x: Variable;
  private _F_y: Variable;
  private _M_z: Variable;

  private _original_F_x: Variable | undefined;
  private _original_F_y: Variable | undefined;
  private _original_M_z: Variable | undefined;

  constructor(name: string, id: number, positionX: number, positionY: number) {
    this._name = name;
    this._id = id;
    this._positionX = positionX;
    this._positionY = positionY;
    this._externalForces = [];

    this._F_x = new Variable(`F_${name}x`);
    this._F_y = new Variable(`F_${name}y`);
    this._M_z = new Variable(`M_${name}z`);
  }

  set F_x(value: number) {
    this._F_x.value = value;
  }

  get F_x() {
    return this._F_x.value;
  }

  set F_y(value: number) {
    this._F_y.value = value;
  }

  get F_y() {
    return this._F_y.value;
  }

  set M_z(value: number) {
    this._M_z.value = value;
  }

  get M_z() {
    return this._M_z.value;
  }

  get symbolF_x(): string {
    let result: string = this._F_x.getValueOrSymbol();
    this._externalForces.forEach((force) => {
      result += "+";
      result += force.symbolF_x;
    });

    return result;
  }

  get symbolF_y(): string {
    let result: string = this._F_y.getValueOrSymbol();
    this._externalForces.forEach((force) => {
      result += "+";
      result += force.symbolF_y;
    });

    return result;
  }

  get symbolM_z(): string {
    return this._M_z.getValueOrSymbol();
  }

  get name() {
    return this._name;
  }

  get id() {
    return this._id;
  }

  get x() {
    return this._positionX;
  }

  set x(x: number) {
    this._positionX = x;
  }

  get y() {
    return this._positionY;
  }

  set y(y: number) {
    this._positionY = y;
  }

  removeConditions(): void {
    this._F_x.clear();
    this._F_y.clear();
    this._M_z.clear();
  }

  addExternalForce(externalForce: ExternalForce) {
    this._externalForces.push(externalForce);

    this.F_x = 0;
    this.F_y = 0;
    this.M_z = 0;
  }

  loadSolution(solutionMap: Map<string, number>) {
    this._original_F_x = this._F_x.clone();
    this._original_F_y = this._F_y.clone();
    this._original_M_z = this._M_z.clone();

    this.F_x = solutionMap.get(this._F_x.symbol) || 0;
    this.F_y = solutionMap.get(this._F_y.symbol) || 0;
    this.M_z = solutionMap.get(this._M_z.symbol) || 0;
  }

  clearSolution() {
    if (!this._original_F_x || !this._original_F_y || !this._original_M_z) {
      return;
    }

    this._F_x = this._original_F_x;
    this._F_y = this._original_F_y;
    this._M_z = this._original_M_z;
  }

  removeExternalForce(externalForce: ExternalForce) {
    this._externalForces = this.externalForces.filter(
      (force) => force.name !== externalForce.name
    );

    if (this._externalForces.length === 0) {
      this.removeConditions();
    }
  }

  hasExternalForce(): boolean {
    return this._externalForces.length !== 0;
  }

  get externalForces() {
    return this._externalForces;
  }

  static fromJson(obj: object, pointMap: Map<number, Point>) {
    if (
      !("_name" in obj && typeof obj._name === "string") ||
      !("_id" in obj && typeof obj._id === "number") ||
      !("_positionX" in obj && typeof obj._positionX === "number") ||
      !("_positionY" in obj && typeof obj._positionY === "number")
    ) {
      throw new Error("Invalid JSON for Point");
    }

    const pointCache = pointMap.get(obj._id);
    if (pointCache) {
      return pointCache;
    }

    const point = new Point(obj._name, obj._id, obj._positionX, obj._positionY);

    if ("_externalForces" in obj && Array.isArray(obj._externalForces)) {
      obj._externalForces.forEach((force: object) => {
        point.addExternalForce(ExternalForce.fromJson(force));
      });
    }

    pointMap.set(point._id, point);

    return point;
  }
}
