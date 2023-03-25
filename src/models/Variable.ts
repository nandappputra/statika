export class Variable {
  private _symbol: string;
  private _known: boolean;
  private _value: number;

  constructor(name: string, value: number | undefined = undefined) {
    this._symbol = name;
    this._known = value ? true : false;
    this._value = value ? value : 0;
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

    throw new Error("Value not set");
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
