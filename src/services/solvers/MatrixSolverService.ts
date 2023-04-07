import { inv, multiply } from "mathjs";
import { Structure } from "../../models/Structure";
import { Variable } from "../../models/Variable";
import { expressEquationsInMatrixMultiplication } from "../../utils/SolverUtils";
import { SolverService } from "./SolverService";

export class MatrixSolverService implements SolverService {
  solve(structure: Structure): Variable[] {
    const matrixExpression = expressEquationsInMatrixMultiplication(
      structure.generateAllEquilibirum()
    );

    const solution = multiply(
      inv(matrixExpression.coefficients),
      matrixExpression.constants
    );

    return matrixExpression.variables.map(
      (variable, index) => new Variable(variable, solution[index])
    );
  }
}
