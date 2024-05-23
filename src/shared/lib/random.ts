import { isNumeric } from "./number";

export function getRandomInt(min: number, max: number): number {
  if (!isNumeric(min) || !isNumeric(max)) {
    console.error("Min and max must be finite numbers");
    return NaN;
  }

  if (min === max) return min;

  if (min > max) {
    console.error("Min must be less or equal than max");
    return NaN;
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomArray(
  min: number,
  max: number,
  count: number,
): number[] {
  if (!isNumeric(min) || !isNumeric(max) || !isNumeric(count)) {
    console.error("Min, max and count must be finite numbers");
    return [];
  }

  if (min === max)
    return Array(count)
      .fill(1)
      .map(() => min);

  if (min > max) {
    console.error("Min must be less or equal than max");
    return [];
  }

  if (count <= 0) {
    console.error("Count must be greater than 0");
    return [];
  }

  const result: number[] = [];
  while (result.length < count) {
    const randomInt = getRandomInt(min, max);
    if (!result.includes(randomInt)) result.push(randomInt);
  }
  return result;
}

export function getRandomBoolean(chance: number = 0.5): boolean {
  if (!isNumeric(chance) || chance < 0 || chance > 1) {
    console.error("Chance must be a finite number between 0 and 1");
    return false;
  }

  return Math.random() < chance;
}
