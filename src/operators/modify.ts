import { Draft, produce } from 'immer';

import { Operator } from '../operator';

type ModifierFunction<T> = (itemDraft: Draft<T>, index: number) => void;

export function modify<T>(modifierFunction: ModifierFunction<T>): Operator<T> {
  return (items: T[]): T[] => {

    return items.map((item, index) => {
      return produce(item, draft => { modifierFunction(draft, index) });
    });
    
  }
}
