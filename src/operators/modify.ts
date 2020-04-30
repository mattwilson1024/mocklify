import { Draft, produce } from 'immer';

import { DEFAULT_LIMITER, Limiter } from '../limiter';
import { Operator } from '../operator';

type ModifierFunction<T> = (itemDraft: Draft<T>, index: number) => void;

export function modify<T>(modifierFunction: ModifierFunction<T>, limiter: Limiter<T> = DEFAULT_LIMITER): Operator<T> {
  return (items: T[]): T[] => {

    return items.map((item, index) => {
      if (!limiter(item, index)) { return item; }
      
      return produce(item, draft => { modifierFunction(draft, index) });
    });
    
  }
}
