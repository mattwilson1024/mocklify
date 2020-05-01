import { Draft, produce } from 'immer';

import { Limiter } from '../limiter';
import { Operator } from '../operator';

type ModifierFunction<T> = (itemDraft: Draft<T>, index: number) => void;

export function modify<T>(modifierFunction: ModifierFunction<T>): Operator<T> {
  return (items: T[], limiter: Limiter<T>): T[] => {

    return items.map((item, index) => {
      if (!limiter(item, index)) { return item; }
      
      return produce(item, draft => { modifierFunction(draft, index) });
    });
    
  }
}