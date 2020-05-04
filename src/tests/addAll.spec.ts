import { FilterPredicate, mocklify } from '../main';
import { IUser, MOCK_USERS } from './test-data/test-data';

describe('addAll()', () => {

  it('adds all matching items', () => {
    const whereNameIsPotter: FilterPredicate<IUser> = user => user.lastName === 'Potter';

    const results: IUser[] = mocklify<IUser>()
      .addAll(MOCK_USERS, whereNameIsPotter)
      .getAll();

    expect(results.length).toBe(6);
  });

  it('adds all items if no predicate is provided', () => {
    const results: IUser[] = mocklify<IUser>()
      .addAll(MOCK_USERS)
      .getAll();

    expect(results.length).toBe(MOCK_USERS.length);
  });

});
