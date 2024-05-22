export function isNumeric(value: number) {
  if (!isFinite(value) || isNaN(+value)) return false;
  return true;
}

export function getNumber(value: string | number) {
  if (typeof value !== "number") return Number(value);
  return value;
}
