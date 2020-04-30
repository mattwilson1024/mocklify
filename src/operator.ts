import { Limiter } from './limiter';

export type Operator<T> = (items: T[], limiter: Limiter<T>) => T[];

export function applyOperators<T>(items: T[], operators: Operator<T>[], limiter: Limiter<T>): T[] {
  let results: T[] = [...items];
  operators.forEach(operator => {
    results = operator(results, limiter);
  });
  return results;
}