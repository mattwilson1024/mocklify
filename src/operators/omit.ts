import produce from 'immer';

import { Operator } from '../operator';

function deletePropsFromObject(item: any, propsToDelete: any[]) {
  propsToDelete.forEach((propToOmit: string) => {
    delete item[propToOmit]
  });
}

export function omit<T>(propsToOmit: Array<keyof T>): Operator<T> {
  return (items: T[]): T[] => {

    return items.map(item => {
      return produce(item, draft => { deletePropsFromObject(draft, propsToOmit); });
    });
    
  }
}
