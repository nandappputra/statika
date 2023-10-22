import { Structure } from "../../models/Structure";

export interface SolverService {
  solve(structure: Structure): Map<string, number>;
}
