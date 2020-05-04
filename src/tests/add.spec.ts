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
    const whereNameDoesntExist: AddPredicate<IUser> = user => user.name.includes('Nonexistant user');

    expect(() => {
      mocklify<IUser>()
        .add(50, MOCK_USERS, whereNameDoesntExist)
        .getAll();
    }).toThrow();
  });

  it('pads the input to the target length', () => {
    const whereNameIsBob: AddPredicate<IUser> = user => user.name.includes('Bob');

    const results = mocklify<IUser>()
      .add(50, MOCK_USERS, whereNameIsBob)
      .getAll();

      expect(results.length).toBe(50);
      expect(results.every(user => user.name.includes('Bob')));
  });

  it('trims input if it excededs target length', () => {
    const results = mocklify<IUser>()
      .add(1, MOCK_USERS)
      .getAll();

    expect(results.length).toBe(1);
  });

});
