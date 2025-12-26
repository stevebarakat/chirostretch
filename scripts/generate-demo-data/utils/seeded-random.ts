import seedrandom from "seedrandom";

export class SeededRandom {
  private rng: seedrandom.PRNG;

  constructor(seed: string) {
    this.rng = seedrandom(seed);
  }

  /** Returns a random float between 0 (inclusive) and 1 (exclusive) */
  random(): number {
    return this.rng();
  }

  /** Returns a random integer between min (inclusive) and max (inclusive) */
  int(min: number, max: number): number {
    return Math.floor(this.random() * (max - min + 1)) + min;
  }

  /** Returns a random float between min and max */
  float(min: number, max: number): number {
    return this.random() * (max - min) + min;
  }

  /** Picks a random element from an array */
  pick<T>(array: T[]): T {
    return array[Math.floor(this.random() * array.length)];
  }

  /** Picks N unique random elements from an array */
  pickN<T>(array: T[], n: number): T[] {
    const shuffled = [...array].sort(() => this.random() - 0.5);
    return shuffled.slice(0, Math.min(n, array.length));
  }

  /** Returns true with the given probability (0-1) */
  chance(probability: number): boolean {
    return this.random() < probability;
  }

  /** Weighted random selection - items with higher weight are more likely */
  weightedPick<T extends { weight: number }>(items: T[]): T {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let random = this.random() * totalWeight;

    for (const item of items) {
      random -= item.weight;
      if (random <= 0) return item;
    }

    return items[items.length - 1];
  }

  /** Shuffle an array in place */
  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(this.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}
