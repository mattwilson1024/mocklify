import { FilterPredicate, mocklify } from '../main';
import { IUser, MOCK_USERS } from './test-data/test-data';

describe('filter()', () => {

  it('filters items to those that match predicate', () => {
    const whereNameIsPotter: FilterPredicate<IUser> = user => user.lastName === 'Potter';

    const results = mocklify<IUser>()
      .addAll(MOCK_USERS)
      .filter(whereNameIsPotter)
      .getAll();

    expect(results.length).toBe(6);
  });

  it('supports filtering at the point of adding data, as well as after', () => {
    const whereLastNameIsPotter: FilterPredicate<IUser> = user => user.lastName === 'Potter';
    const whereFirstNameIsHarry: FilterPredicate<IUser> = user => user.firstName === 'Harry';

    const results = mocklify<IUser>()
      .addAll(MOCK_USERS, whereLastNameIsPotter)
      .filter(whereFirstNameIsHarry)
      .getAll();

    expect(results.length).toBe(1);
  });

});
