export class Variable {
  private _symbol: string;
  private _known: boolean;
  private _value: number;

  constructor(name: string, value: number | undefined = undefined) {
    this._symbol = name;
    this._known = typeof value === "number" ? true : false;
    this._value = typeof value === "number" ? value : 0;
  }

  clone(): Variable {
    if (this._known) {
      return new Variable(this._symbol, this._value);
    }

    return new Variable(this._symbol);
  }

  get symbol(): string {
    return this._symbol;
  }

  set value(value: number) {
    this._known = true;
    this._value = value;
  }

  get value(): number {
    if (this._known) {
      return this._value;
    }

    throw new Error(`failed to get ${this._symbol} value: value not set`);
  }

  get isKnown(): boolean {
    return this._known;
  }

  clear(): void {
    this._known = false;
    this._value = 0;
  }

  getValueOrSymbol(): string {
    if (this._known) {
      return this._value.toString();
    }

    return this._symbol;
  }
}
