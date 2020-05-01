import { Limiter } from './limiter';
import { Scope } from './scope';

export type OperatorActionFunction<T> = (items: T[], limiter: Limiter<T>) => T[];

export abstract class Operator<T> {
  constructor(public name: string, public action: OperatorActionFunction<T>) {}
}

export function applyOperators<T>(items: T[], operators: Array<Scope<T>|Operator<T>>, limiter: Limiter<T>): T[] {
  let results: T[] = [...items];
  operators.forEach(operator => {
    if (operator instanceof Scope) {
      results = operator.action(results);
    } else {
      results = operator.action(results, limiter);
    }
  });
  return results;
}
