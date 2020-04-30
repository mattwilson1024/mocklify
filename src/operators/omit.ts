import produce from 'immer';

import { DEFAULT_LIMITER, Limiter } from '../limiter';
import { Operator } from '../operator';

export function omit<T>(propsToOmit: Array<keyof T>, limiter: Limiter<T> = DEFAULT_LIMITER): Operator<T> {
  return (items: T[]): T[] => {

    return items.map((item, index) => {
      if (!limiter(item, index)) { return item; }

      return produce(item, draft => { deletePropsFromObject(draft, propsToOmit); });
    });
    
  }
}

function deletePropsFromObject(item: any, propsToDelete: any[]) {
  propsToDelete.forEach((propToOmit: string) => {
    delete item[propToOmit]
  });
}