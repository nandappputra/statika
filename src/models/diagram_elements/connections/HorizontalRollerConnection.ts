import { ConnectionKind } from "../../../utils/Constants";
import { Point } from "../Point";
import { Connection } from "./Connection";

export class HorizontalRollerConnection implements Connection {
  private static instance: HorizontalRollerConnection;
  private _kind = ConnectionKind.HORIZONTAL_ROLLER;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance() {
    if (!this.instance) {
      this.instance = new HorizontalRollerConnection();
    }

    return this.instance;
  }

  get kind() {
    return this._kind;
  }

  applyBoundaryCondition(point: Point) {
    point.M_z = 0;
  }

  getF_x(_name: string): string {
    return "0";
  }
  getF_y(name: string): string {
    return `-1*F_${name}y_ground`;
  }
  getM_z(_name: string): string {
    return "0";
  }
}
