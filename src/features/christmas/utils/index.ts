import { Pair } from "../types";

export const parseNames = (input: string): string[] =>
  input
    .split(/[;,\n]+/) // Support newlines as well
    .map(n => n.trim().replace(/[^a-zA-ZÀ-ỹ0-9 ]/g, "")) // Basic XSS/Injection prevent, allow vietnamese
    .filter(n => n.length > 0);

export const createPairs = (names: string[]): Pair[] => {
  const shuffled = [...names].sort(() => Math.random() - 0.5);
  const pairs: Pair[] = [];
  let i = 0;

  while (i < shuffled.length) {
    if (shuffled.length - i === 3 || (shuffled.length - i === 1 && pairs.length > 0)) {
      const group = shuffled.slice(i, i + 3);
      if (group.length === 3) {
        pairs.push({ names: group });
        i += 3;
      } else {
        if (pairs.length > 0) {
          pairs[pairs.length - 1].names.push(group[0]);
        }
        i++;
      }
    } else if (i + 1 < shuffled.length) {
      pairs.push({ names: [shuffled[i], shuffled[i + 1]] });
      i += 2;
    } else {
      if (pairs.length > 0) {
        pairs[pairs.length - 1].names.push(shuffled[i]);
      } else {
        pairs.push({ names: [shuffled[i]] });
      }
      i++;
    }
  }

  return pairs;
};