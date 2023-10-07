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

  set F_y(value: number) {
    this._F_y.value = value;
  }

  set M_z(value: number) {
    this._M_z.value = value;
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
}
