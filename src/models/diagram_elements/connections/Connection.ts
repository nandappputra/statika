import { ConnectionKind } from "../../../utils/Constants";
import { Point } from "../../Point";

export interface Connection {
  kind: ConnectionKind;

  applyBoundaryCondition(point: Point): void;

  getF_x(name: string): string;
  getF_y(name: string): string;
  getM_z(name: string): string;
}
