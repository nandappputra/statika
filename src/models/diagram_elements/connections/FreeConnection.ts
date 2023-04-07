import { Point } from "../../Point";
import { Connection } from "./Connection";

export class FreeConnection extends Connection {
  applyBoundaryCondition(point: Point) {
    point.F_x = 0;
    point.F_y = 0;
    point.M_z = 0;
  }
}
