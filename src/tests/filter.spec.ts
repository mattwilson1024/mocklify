import { AddPredicate, FilterPredicate, mocklify } from '../main';
import { IUser, MOCK_USERS } from './test-data/test-data';

describe('filter()', () => {

  it('filters items to those that match predicate', () => {
    const whereNameIsPotter: FilterPredicate<IUser> = user => user.lastName === 'Potter';

    const results: IUser[] = mocklify<IUser>()
      .addAll(MOCK_USERS)
      .filter(whereNameIsPotter)
      .getAll();

    expect(results.length).toBe(6);
  });

  it('filters items to those that match predicate', () => {
    const whereLastNameIsPotter: AddPredicate<IUser> = user => user.lastName === 'Potter';
    const whereFirstNameIsHarry: FilterPredicate<IUser> = user => user.firstName === 'Harry';

    const results: IUser[] = mocklify<IUser>()
      .addAll(MOCK_USERS, whereLastNameIsPotter)
      .filter(whereFirstNameIsHarry)
      .getAll();

    expect(results.length).toBe(1);
  });

});


// TODO
/*

bob, john, fred, harry, frank, harry

add(5, user => harry)   /// harry1, harry2, harry1, harry2, harry1
filter(harry) // harry1, harry2, harry1, harry2, harry1


add(5) // bob, john, fred, harry, frank
filter(user => harry) // harry1

*/
