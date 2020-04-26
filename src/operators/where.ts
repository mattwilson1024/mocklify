import { Operator } from '../operator';

type WherePredicate<T> = (item: T) => boolean;

export function where<T>(predicate: WherePredicate<T>): Operator<T> {
  return (items: T[]): T[] => {
    return items.filter(item => predicate(item));
  }
}
