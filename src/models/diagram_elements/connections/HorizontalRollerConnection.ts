import { Point } from "../../Point";
import { Connection } from "./Connection";

export class HorizontalRollerConnection extends Connection {
  applyBoundaryCondition(point: Point) {
    point.F_x = 0;
    point.M_z = 0;
  }
}
