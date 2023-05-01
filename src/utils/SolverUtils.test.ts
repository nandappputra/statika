import { describe, expect, test } from "@jest/globals";
import { expressEquationsInMatrixMultiplication } from "./SolverUtils";

describe("SolverUtils", () => {
  describe("expressEquationsInMatrixMultiplication", () => {
    test("Should convert equations into proper matrix representation", () => {
      const equations = [
        "1*F_P1x+0+0+0",
        "1*F_P1y+1*F_P2y+0+100",
        "0*F_P1x+0*F_P1y+0+0+-300*F_P2y+0+0+0+0+-10000+0",
      ];

      const actualResult = expressEquationsInMatrixMultiplication(equations);
      const expectedResult = {
        coefficients: [
          [1, 0, 0],
          [0, 1, 1],
          [0, 0, -300],
        ],
        constants: [0, -100, 10000],
        variables: ["F_P1x", "F_P1y", "F_P2y"],
      };

      expect(actualResult).toStrictEqual(expectedResult);
    });

    test("Should remove redundant equations", () => {
      const equations = ["1*F_P1x+0+0+0", "2*F_P1x+0+0+0"];

      const actualResult = expressEquationsInMatrixMultiplication(equations);
      const expectedResult = {
        coefficients: [[1]],
        constants: [0],
        variables: ["F_P1x"],
      };

      expect(actualResult).toStrictEqual(expectedResult);
    });

    test("Should remove equations with all zeros as its coefficient", () => {
      const equations = ["0+0+0"];

      const actualResult = expressEquationsInMatrixMultiplication(equations);
      const expectedResult = {
        coefficients: [],
        constants: [],
        variables: [],
      };

      expect(actualResult).toStrictEqual(expectedResult);
    });

    test("Should throw error when equation has constant but zeros for all of its coefficient", () => {
      const equations = ["0+0+0+300"];

      expect(() => expressEquationsInMatrixMultiplication(equations)).toThrow(
        "failed to convert to matrix equation: unsolvable equation found"
      );
    });
  });
});
