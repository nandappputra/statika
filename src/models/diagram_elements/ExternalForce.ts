import { Variable } from "../Variable";

export class ExternalForce {
  private _name: string;
  private _id: number;

  private _F_x: Variable;
  private _F_y: Variable;

  constructor(name: string, id: number, F_x: number, F_y: number) {
    this._name = name;
    this._id = id;

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

  get id() {
    return this._id;
  }

  set F_x(F_x: number) {
    this._F_x = new Variable(`${this._name}x`, F_x);
  }

  set F_y(F_y: number) {
    this._F_y = new Variable(`${this._name}y`, F_y);
  }

  static fromJson(obj: object) {
    if (
      !("_name" in obj && typeof obj._name === "string") ||
      !("_id" in obj && typeof obj._id === "number") ||
      !("_F_x" in obj && typeof obj._F_x === "object" && obj._F_x) ||
      !("_value" in obj._F_x && typeof obj._F_x._value === "number") ||
      !("_F_y" in obj && typeof obj._F_y === "object" && obj._F_y) ||
      !("_value" in obj._F_y && typeof obj._F_y._value === "number")
    ) {
      throw new Error("Invalid JSON for External Force");
    }

    return new ExternalForce(
      obj._name,
      obj._id,
      obj._F_x._value,
      obj._F_y._value
    );
  }
}
