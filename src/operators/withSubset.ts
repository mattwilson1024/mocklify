import { applyOperators, Operator } from '../operator';

export interface WithSubsetConstraints {
  fromIndex: number;
  toIndex: number;
}

export function withSubset<T>(constraints: WithSubsetConstraints, operators: Operator<T>[]): Operator<T> {
  return (items: T[]): T[] => {

    return items.map((item, index) => {
      const itemIsAffected = index >= constraints.fromIndex && index <= constraints.toIndex;

      if (itemIsAffected) {
        return applyOperators([item], ...operators)?.[0];
      } else {
        return item;
      }
    });

  }
}
