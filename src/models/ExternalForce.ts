import { Variable } from "./Variable";

export class ExternalForce {
  private _name: string;

  private _F_x: Variable;
  private _F_y: Variable;

  constructor(name: string, F_x: number, F_y: number) {
    this._name = name;

    this._F_x = new Variable(`F_${name}x`, F_x);
    this._F_y = new Variable(`F_${name}y`, F_y);
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
}
