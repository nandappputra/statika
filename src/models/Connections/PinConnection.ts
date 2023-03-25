import { Point } from "../Point";
import { Connection } from "./Connection";

export class PinConnection extends Connection {
  applyBoundaryCondition(point: Point) {
    point.M_z = 0;
  }
}
