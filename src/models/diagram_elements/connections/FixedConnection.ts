import { ConnectionKind } from "../../../utils/Constants";
import { Point } from "../Point";
import { Connection } from "./Connection";

export class FixedConnection implements Connection {
  private static instance: FixedConnection;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance() {
    if (!this.instance) {
      this.instance = new FixedConnection();
    }

    return this.instance;
  }

  get kind() {
    return ConnectionKind.FIXED;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  applyBoundaryCondition(_point: Point) {}

  getF_x(name: string): string {
    return `1*F_${name}x_ground`;
  }
  getF_y(name: string): string {
    return `1*F_${name}y_ground`;
  }
  getM_z(name: string): string {
    return `1*M_${name}z_ground`;
  }
}
