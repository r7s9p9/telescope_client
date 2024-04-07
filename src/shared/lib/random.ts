export function getRandomInt(min: number, max: number) {
    return Math.ceil(Math.random() * (max - min) + min * 1/2) * 2
  }

export function getRandomBoolean() {
    return Math.random() < 0.5;
}
