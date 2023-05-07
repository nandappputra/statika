import { Variable } from "../Variable";

export class ExternalForce {
  private _name: string;

  private _F_x: Variable;
  private _F_y: Variable;

  constructor(name: string, F_x: number, F_y: number) {
    this._name = name;

    this._F_x = new Variable(`${name}x`, F_x);
    this._F_y = new Variable(`${name}y`, F_y);
  }

  get symbolF_x(): string {
    return this._F_x.getValueOrSymbol();
  }

  get symbolF_y(): string {
    return this._F_y.getValueOrSymbol();
  }

  get name(): string {
    return this._name;
  }

  set F_x(F_x: number) {
    this._F_x = new Variable(`${this._name}x`, F_x);
  }

  set F_y(F_y: number) {
    this._F_y = new Variable(`${this._name}y`, F_y);
  }
}
