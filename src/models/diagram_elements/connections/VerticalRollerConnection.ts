import { ConnectionKind } from "../../../utils/Constants";
import { Point } from "../Point";
import { Connection } from "./Connection";

export class VerticalRoller implements Connection {
  private static instance: VerticalRoller;
  private _kind = ConnectionKind.VERTICAL_ROLLER;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance() {
    if (!this.instance) {
      this.instance = new VerticalRoller();
    }

    return this.instance;
  }

  get kind() {
    return this._kind;
  }

  applyBoundaryCondition(point: Point) {
    point.M_z = 0;
  }

  getF_x(name: string): string {
    return `-1*F_${name}x_ground`;
  }

  getF_y(_name: string): string {
    return "0";
  }
  getM_z(_name: string): string {
    return "0";
  }
}
