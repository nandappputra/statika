export function formatMomentForSolver(signedDistance: number, value: string) {
  const valueInNumber = parseFloat(value);
  if (Number.isNaN(valueInNumber)) {
    return `${signedDistance}*${value}`;
  }

  return `${signedDistance * valueInNumber}`;
}

export function formatForceForSolver(force: string) {
  if (Number.isNaN(parseFloat(force))) {
    return `1*${force}`;
  }

  return force;
}
