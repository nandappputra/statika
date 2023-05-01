import { Point } from "../../Point";
import { Connection } from "./Connection";

export class FreeConnection implements Connection {
  private static instance: FreeConnection;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance() {
    if (!this.instance) {
      this.instance = new FreeConnection();
    }

    return this.instance;
  }

  applyBoundaryCondition(point: Point) {
    point.F_x = 0;
    point.F_y = 0;
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
