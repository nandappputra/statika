import { inv, multiply } from "mathjs";
import { Structure } from "../../models/Structure";
import { expressEquationsInMatrixMultiplication } from "../../utils/SolverUtils";
import { SolverService } from "./SolverService";

export class MatrixSolverService implements SolverService {
  solve(structure: Structure): Map<string, number> {
    const matrixExpression = expressEquationsInMatrixMultiplication(
      structure.generateAllEquilibirum()
    );

    const solution = multiply(
      inv(matrixExpression.coefficients),
      matrixExpression.constants
    );

    const results = new Map<string, number>();

    matrixExpression.variables.forEach((variable, index) =>
      results.set(variable, solution[index])
    );

    return results;
  }
}
