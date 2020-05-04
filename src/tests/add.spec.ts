import { AddPredicate, mocklify } from '../main';
import { IUser, MOCK_USERS } from './test-data/test-data';

describe('add()', () => {

  it('adds first n items if no predicate is specified', () => {
    const results = mocklify<IUser>()
      .add(MOCK_USERS.length, MOCK_USERS)
      .getAll();

    expect(results.length).toBe(MOCK_USERS.length);
    expect(results).toEqual(MOCK_USERS);
  });

  it('throws an error if no items match the predicate', () => {
    const whereNameDoesntExist: AddPredicate<IUser> = user => user.firstName === 'Nonexistant user';

    expect(() => {
      mocklify<IUser>()
        .add(50, MOCK_USERS, whereNameDoesntExist)
        .getAll();
    }).toThrow();
  });

  it('pads the results to the target length if the number of matches is less than the target length', () => {
    const whereNameIsBob: AddPredicate<IUser> = user => user.lastName === 'Potter';

    const results = mocklify<IUser>()
      .add(50, MOCK_USERS, whereNameIsBob)
      .getAll();

      expect(results.length).toBe(50);
      expect(results.every(user => user.lastName === 'Potter'));
  });

  it('should repeat the matched items to reach the target length when padding', () => {
    const results = mocklify<IUser>()
      .add(12, MOCK_USERS, user => user.lastName === 'Potter')
      .getAll();

    expect(results.length).toBe(12);
    expect(results[0]).toEqual(results[6]);
    expect(results[1]).toEqual(results[7]);
    expect(results[2]).toEqual(results[8]);
    expect(results[3]).toEqual(results[9]);
    expect(results[4]).toEqual(results[10]);
    expect(results[5]).toEqual(results[11]);
  });

  it('trims the results down if the number of matches exceeds the target length', () => {
    const results = mocklify<IUser>()
      .add(1, MOCK_USERS)
      .getAll();

    expect(results.length).toBe(1);
  });

});
