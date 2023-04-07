import { Point } from "../../Point";
import { Connection } from "./Connection";

export class FixedConnection extends Connection {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  applyBoundaryCondition(_point: Point) {}
}
