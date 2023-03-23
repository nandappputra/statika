import { Point } from "./Point";

export class ExternalForce {
  private _name: string;
  private _point: Point;

  constructor(
    name: string,
    positionX: number,
    positionY: number,
    F_x: number,
    F_y: number
  ) {
    this._name = name;
    this._point = new Point(`F_${name}`, positionX, positionY);

    this._point.F_x = F_x;
    this._point.F_y = F_y;
    this._point.M_z = 0;
  }
}
