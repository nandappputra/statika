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
        topology[CONSTANT] = topology[CONSTANT]
          ? topology[CONSTANT] + coefficientNumeric
          : coefficientNumeric;
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

export function formatMomentForSolver(
  signedDistance: number,
  value: string,
  invertSign = false
) {
  const valueInNumber = parseFloat(value);
  if (Number.isNaN(valueInNumber)) {
    const result: string[] = [];
    const adjustedDistance = invertSign ? -1 * signedDistance : signedDistance;

    const operands = value.split("+");
    operands.forEach((operand) => {
      const operandInNumber = parseFloat(operand);

      if (Number.isNaN(operandInNumber)) {
        result.push(`${adjustedDistance}*${operand}`);
      } else {
        result.push(`${adjustedDistance * operandInNumber}`);
      }

      result.push("+");
    });

    const finalResult = result.join("");

    return finalResult.substring(0, finalResult.length - 1);
  }

  return `${signedDistance * valueInNumber}`;
}

export function formatForceForSolver(force: string) {
  if (Number.isNaN(parseFloat(force))) {
    const result: string[] = [];

    const operands = force.split("+");
    operands.forEach((operand) => {
      if (Number.isNaN(parseFloat(operand))) {
        result.push(`1*${operand}`);
      } else {
        result.push(operand);
      }

      result.push("+");
    });

    const finalResult = result.join("");

    return finalResult.substring(0, finalResult.length - 1);
  }

  return force;
}
