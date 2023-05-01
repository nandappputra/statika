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

  const [filteredCoefficients, filteredConstants] = removeRedundancy(
    coefficientOnly,
    constants
  );

  return {
    coefficients: filteredCoefficients,
    variables: variableList,
    constants: filteredConstants,
  };
}

function removeRedundancy(
  coefficients: number[][],
  constants: number[]
): [number[][], number[]] {
  const filteredCoefficients: number[][] = [];
  const filteredConstants: number[] = [];

  const allCoefficients: Set<string> = new Set<string>();

  for (let i = 0; i < coefficients.length; i++) {
    const magnitude = calculateVectorMagnitude(coefficients[i]);
    if (magnitude === 0) {
      if (constants[i] !== 0) {
        throw new Error(
          "failed to convert to matrix equation: unsolvable equation found"
        );
      }
      continue;
    }

    const normalized = normalizeVector(coefficients[i], magnitude);
    if (allCoefficients.has(normalized.toString())) {
      continue;
    }

    allCoefficients.add(normalized.toString());
    filteredCoefficients.push(coefficients[i]);
    filteredConstants.push(constants[i]);
  }

  return [filteredCoefficients, filteredConstants];
}

function calculateVectorMagnitude(components: number[]): number {
  return Math.sqrt(
    components.reduce((prev, current) => prev + current * current, 0)
  );
}

function normalizeVector(components: number[], magnitude: number) {
  return components.map((component) => component / magnitude);
}

export function formatMomentForSolver(
  signedDistance: number,
  value: string,
  invertSign = false
) {
  if (signedDistance == 0) {
    return "0";
  }

  const valueInNumber = parseFloat(value);
  if (value.includes("+") || Number.isNaN(valueInNumber)) {
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

export function formatForceForSolver(force: string, invertSign = false) {
  if (Number.isNaN(parseFloat(force))) {
    const result: string[] = [];

    const operands = force.split("+");
    operands.forEach((operand) => {
      if (Number.isNaN(parseFloat(operand))) {
        if (invertSign) {
          result.push(`-1*${operand}`);
        } else {
          result.push(`1*${operand}`);
        }
      } else {
        if (invertSign) {
          result.push(`-${operand}`);
        } else {
          result.push(`${operand}`);
        }
      }

      result.push("+");
    });

    const finalResult = result.join("");

    return finalResult.substring(0, finalResult.length - 1);
  }

  return invertSign ? `-1*${force}` : force;
}
