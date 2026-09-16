/**
 * A fast 32-bit seeded random number generator (Mulberry32).
 * Returns a function that generates a random float between 0 (inclusive) and 1 (exclusive).
 */
export function seededRandom(seed: number) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}
