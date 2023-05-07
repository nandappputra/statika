import { ConnectionKind } from "../../../utils/Constants";
import { Point } from "../Point";
import { Connection } from "./Connection";

export class PinJointConnection implements Connection {
  private static instance: PinJointConnection;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance() {
    if (!this.instance) {
      this.instance = new PinJointConnection();
    }

    return this.instance;
  }

  get kind() {
    return ConnectionKind.PIN_JOINT;
  }

  applyBoundaryCondition(point: Point) {
    point.M_z = 0;
  }

  getF_x(_name: string): string {
    return "0";
  }
  getF_y(_name: string): string {
    return "0";
  }
  getM_z(_name: string): string {
    return "0";
  }
}
