export function randomIndex(length: number, random: () => number): number {
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) {
    throw new Error('Random function must return a number in [0, 1).');
  }
  return Math.floor(value * length);
}

export function shuffle<T>(
  values: readonly T[],
  random: () => number = Math.random
): T[] {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1, random);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
