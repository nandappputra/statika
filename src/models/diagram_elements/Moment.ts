import { Variable } from "../Variable";

export class Moment {
  private _name: string;
  private _id: number;

  private _M_z: Variable;

  constructor(name: string, id: number, M_z: number) {
    this._name = name;
    this._id = id;

    this._M_z = new Variable(`${name}z`, M_z);
  }

  get symbolM_z(): string {
    return this._M_z.getValueOrSymbol();
  }

  get name(): string {
    return this._name;
  }

  get id() {
    return this._id;
  }

  set M_z(M_z: number) {
    this._M_z = new Variable(`${this._name}z`, M_z);
  }

  get M_z() {
    return this._M_z.value;
  }

  static fromJson(obj: object) {
    if (
      !("_name" in obj && typeof obj._name === "string") ||
      !("_id" in obj && typeof obj._id === "number") ||
      !("_M_z" in obj && typeof obj._M_z === "object" && obj._M_z) ||
      !("_value" in obj._M_z && typeof obj._M_z._value === "number")
    ) {
      throw new Error("Invalid JSON for External Force");
    }

    return new Moment(obj._name, obj._id, obj._M_z._value);
  }
}
