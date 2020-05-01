import { Limiter } from './limiter';

export type OperatorActionFunction<T> = (items: T[], limiter: Limiter<T>) => T[];

export abstract class Operator<T> {
  constructor(public name: string, public action: OperatorActionFunction<T>) {}
}

export function applyOperators<T>(items: T[], operators: Operator<T>[], limiter: Limiter<T>): T[] {
  let results: T[] = [...items];
  operators.forEach(operator => {
    results = operator.action(results, limiter);
  });
  return results;
}