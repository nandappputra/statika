export class Variable {
  private _name: string;
  private _known: boolean;
  private _value: number;

  constructor(name: string) {
    this._name = name;
    this._known = false;
    this._value = 0;
  }

  get name(): string {
    return this._name;
  }

  set value(value: number) {
    this._known = true;
    this._value = value;
  }

  get value(): number {
    if (this._known) {
      return this._value;
    }

    throw new Error("Value not set");
  }

  clear(): void {
    this._known = false;
    this._value = 0;
  }
}
