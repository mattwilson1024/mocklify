import { Limiter } from './limiter';
import { Operator } from './operator';

export abstract class Scope<T> {
  constructor(name: string, protected limiter: Limiter<T>, protected operators: Operator<T>[]) {}

  abstract action(items: T[]): T[];
}