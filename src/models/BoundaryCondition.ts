export interface BoundaryCondition {
  F_x: number | string;
  F_y: number | string;
  F_z: number | string;
  unknowns: number;
}
