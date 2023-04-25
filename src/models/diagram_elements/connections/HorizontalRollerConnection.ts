import { Point } from "../../Point";
import { Connection } from "./Connection";

export class HorizontalRollerConnection implements Connection {
  private static instance: HorizontalRollerConnection;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance() {
    if (!this.instance) {
      this.instance = new HorizontalRollerConnection();
    }

    return this.instance;
  }

  applyBoundaryCondition(point: Point) {
    point.F_x = 0;
    point.M_z = 0;
  }
}
