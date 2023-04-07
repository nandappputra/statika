import { Structure } from "../../models/Structure";
import { Variable } from "../../models/Variable";

export interface SolverService {
  solve(structure: Structure): Variable[];
}
