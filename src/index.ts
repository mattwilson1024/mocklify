import { Draft, produce } from 'immer';

export interface IQuery<T> {
  where?: (item: T) => boolean;
  omit?: Array<keyof T>,
  modify?: (itemDraft: Draft<T>) => void;
  override?: Partial<T>;
}


export class Mocklify<T> {
  
  constructor(private data: T[]) {

  }

  public getOne(query: IQuery<T>): T|null {
    const items = query.where
      ? this.data.filter(item => query.where?.(item))
      : this.data;
    
    const firstItem = items?.[0];

    if (!firstItem) {
      return null;
    }

    const result = produce(firstItem, draft => {
      if (query.omit && query.omit.length) {
        query.omit.forEach(propToOmit => {
          delete (draft as any)[propToOmit as string]; // TODO: Make this line less terrible :D
        })
      }

      if (query.modify) {
        query.modify(draft);
      }

      if (query.override) {
        Object.assign(draft, query.override);
      }
    });

    return result;
  }
  
}