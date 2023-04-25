import { Point } from "../../Point";
import { Connection } from "./Connection";

export class PinConnection implements Connection {
  private static instance: PinConnection;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance() {
    if (!this.instance) {
      this.instance = new PinConnection();
    }

    return this.instance;
  }

  applyBoundaryCondition(point: Point) {
    point.M_z = 0;
  }
}
