interface TopologyMap {
  [variable: string]: number;
}

interface MatrixExpression {
  coefficients: number[][];
  variables: string[];
  constants: number[];
}

const CONSTANT = "!_constant_!";

export function expressEquationsInMatrixMultiplication(
  equations: string[]
): MatrixExpression {
  const allVariables = new Set<string>();
  const allTopologies: TopologyMap[] = [];

  equations.forEach((equation) => {
    const expression = equation.split("+");
    const topology: TopologyMap = {};

    expression.forEach((element) => {
      const [coefficient, variable] = element.split("*");
      const coefficientNumeric = parseInt(coefficient);

      if (!variable) {
        topology[CONSTANT] = coefficientNumeric;
      } else {
        topology[variable] = coefficientNumeric;
        allVariables.add(variable);
      }
    });

    allTopologies.push(topology);
  });
  const variableList = Array.from(allVariables);

  const coefficientOnly: number[][] = [];
  const constants: number[] = [];

  allTopologies.forEach((topology) => {
    const coefficients: number[] = [];

    variableList.forEach((variable) => {
      if (topology[variable]) {
        coefficients.push(topology[variable]);
      } else {
        coefficients.push(0);
      }
    });

    if (topology[CONSTANT]) {
      constants.push(-1 * topology[CONSTANT]);
    } else {
      constants.push(0);
    }

    coefficientOnly.push(coefficients);
  });

  return {
    coefficients: coefficientOnly,
    variables: variableList,
    constants,
  };
}
