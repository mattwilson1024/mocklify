import { Limiter } from '../limiter';
import { applyOperators, Operator } from '../operator';
import { Scope } from '../scope';

export class WhereScope<T> extends Scope<T> {
  constructor(limiter: Limiter<T>, operators: Operator<T>[]) {
    super('where', limiter, operators);
  }

  action(items: T[]): T[] {
    return applyOperators(items, this.operators, this.limiter);
  }
}

export function where<T>(limiter: Limiter<T>, ...operators: Operator<T>[]) {
  return new WhereScope(limiter, operators);
}
