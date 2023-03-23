import { Variable } from "./Variable";

export class Point {
  private _name: string;
  private _positionX: number;
  private _positionY: number;

  private _F_x: Variable;
  private _F_y: Variable;
  private _M_z: Variable;

  constructor(name: string, positionX: number, positionY: number) {
    this._name = name;
    this._positionX = positionX;
    this._positionY = positionY;

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
    return this._F_x.isKnown ? this._F_x.value.toString() : this._F_x.name;
  }

  get symbolF_y(): string {
    return this._F_y.isKnown ? this._F_y.value.toString() : this._F_y.name;
  }

  get symbolM_z(): string {
    return this._M_z.isKnown ? this._M_z.value.toString() : this._M_z.name;
  }

  get name() {
    return this._name;
  }

  get x() {
    return this._positionX;
  }

  get y() {
    return this._positionY;
  }

  removeConditions(): void {
    this._F_x.clear();
    this._F_y.clear();
    this._M_z.clear();
  }
}
