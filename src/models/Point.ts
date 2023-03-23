export enum PointType {
  FREE_END = "free_end",
}

export class Point {
  private _name: string;
  private _positionX: number;
  private _positionY: number;
  private _type: string;

  constructor(
    name: string,
    positionX: number,
    positionY: number,
    type: string = PointType.FREE_END
  ) {
    this._name = name;
    this._positionX = positionX;
    this._positionY = positionY;
    this._type = type;
  }
}
