export type Limiter<T> = (item: T, index: number) => boolean;

export const DEFAULT_LIMITER = <T>(item: T, index: number) => true;
