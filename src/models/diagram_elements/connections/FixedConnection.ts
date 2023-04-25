import { Point } from "../../Point";
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

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  applyBoundaryCondition(_point: Point) {}
}
