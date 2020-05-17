import { FilterPredicate, mocklify } from '../main';
import { override } from '../operators';
import { IUser, MOCK_USERS } from './test-data/test-data';

describe('terminators', () => {

  it('[getAll] gets all the updated results', () => {
    const results = mocklify<IUser>()
      .addAll(MOCK_USERS)
      .getAll();

    expect(results.length).toEqual(MOCK_USERS.length);
  });

  it('[getFirst] gets the first item of the updated results', () => {
    const result = mocklify<IUser>()
      .addAll(MOCK_USERS)
      .getFirst();

    expect(result).toEqual(MOCK_USERS[0]);
  });

  it('[getLast] gets the last item of the updated results', () => {
    const result  = mocklify<IUser>()
      .addAll(MOCK_USERS)
      .getLast();

    const lastIndex = MOCK_USERS.length - 1;
    expect(result).toEqual(MOCK_USERS[lastIndex]);
  });

  it('[get] gets the first n results', () => {
    const results = mocklify<IUser>()
      .addAll(MOCK_USERS)
      .get(10);

    const firstTenUsers = MOCK_USERS.slice(0, 10);
    expect(results).toEqual(firstTenUsers);
    expect(results.length).toBe(10);
  });

  it('[get] if the number is greater than the length of the results should return all it can but not pad or dupe', () => {
    const results = mocklify<IUser>()
      .addAll(MOCK_USERS)
      .get(MOCK_USERS.length + 100);

    expect(results).toEqual(MOCK_USERS);
  });

  it('[get] if number is negative you get an empty array', () => {
    const results = mocklify<IUser>()
      .addAll(MOCK_USERS)
      .get(-5);

    expect(results).toEqual([]);
  });

  it('[get] if number is a float it is floored', () => {
    const results = mocklify<IUser>()
      .addAll(MOCK_USERS)
      .get(5.2);
    const results2 = mocklify<IUser>()
      .addAll(MOCK_USERS)
      .get(5.9);

    expect(results.length).toBe(5);
    expect(results2.length).toBe(5);
  });

  it('[getSlice] you can get a slice of the results', () => {
    const resultsFirstFive = mocklify<IUser>()
      .addAll(MOCK_USERS)
      .getSlice(0, 5);
    const resultsSecondAndThird = mocklify<IUser>()
      .addAll(MOCK_USERS)
      .getSlice(1, 3);
    const resultsLast = mocklify<IUser>()
      .addAll(MOCK_USERS)
      .getSlice(-1);
    const resultsAllButFirstAndLast = mocklify<IUser>()
      .addAll(MOCK_USERS)
      .getSlice(1, -1);

    expect(resultsFirstFive).toEqual(MOCK_USERS.slice(0, 5));
    expect(resultsFirstFive.length).toBe(5);

    expect(resultsSecondAndThird).toEqual(MOCK_USERS.slice(1, 3));
    expect(resultsSecondAndThird.length).toBe(2);

    expect(resultsLast).toEqual(MOCK_USERS.slice(-1));
    expect(resultsLast.length).toBe(1);

    expect(resultsAllButFirstAndLast).toEqual(MOCK_USERS.slice(1, -1));
    expect(resultsAllButFirstAndLast.length).toBe(MOCK_USERS.length - 2);
  });

  it('[getOne] return first item that matches the predicate', () => {
    const whereNameIsPotter: FilterPredicate<IUser> = user => user.lastName === 'Potter';

    const result = mocklify<IUser>()
      .addAll(MOCK_USERS)
      .getOne(whereNameIsPotter);

    expect(result).not.toBeUndefined()
    expect(result?.firstName).toEqual('Harry');
  });

  it('[getOne] returns undefined if the predicate is not matched', () => {
    const whereNameDoesNotExist: FilterPredicate<IUser> = user => user.lastName === 'Non Existent Character';

    const result = mocklify<IUser>()
      .addAll(MOCK_USERS)
      .getOne(whereNameDoesNotExist);

    expect(result).toBeUndefined()
  });

  it('[getWhere] gets all the updated results that match the predicate', () => {
    const whereNameIsPotter: FilterPredicate<IUser> = user => user.lastName === 'Potter';
    const results = mocklify<IUser>()
      .addAll(MOCK_USERS)
      .getWhere(whereNameIsPotter);

    expect(results.length).toBe(6);
  });

  it('[getWhere] gets all the updated results that match the predicate', () => {
    const whereNameIsHazzer: FilterPredicate<IUser> = user => user.firstName === 'Hazzer';
    const results = mocklify<IUser>()
      .add(1, MOCK_USERS)
      .mutate(
        override({firstName: 'Hazzer'})
      )
      .getWhere(whereNameIsHazzer);

    expect(results.length).toBe(1);
  });

  it('[getRandom] gets a random selection of results', () => {
    const results = mocklify<IUser>()
      .addAll(MOCK_USERS)
      .getRandom(5);

    expect(results.length).toBe(5);
  });

  it('[getRandom] gets a random selection of results, up to the length of the original array (shuffle the items)', () => {
    const results = mocklify<IUser>()
      .addAll(MOCK_USERS)
      .getRandom(MOCK_USERS.length + 100);

    expect(results.length).toBe(MOCK_USERS.length);
  });

  it('[getRandom] returns an empty array if you ask for less than one random items', () => {
    const resultsZero = mocklify<IUser>()
      .addAll(MOCK_USERS)
      .getRandom(0);

    const resultsNegative = mocklify<IUser>()
      .addAll(MOCK_USERS)
      .getRandom(-1);

    expect(resultsZero).toEqual([]);
    expect(resultsNegative).toEqual([]);
  });

  it('[getShuffled] returns the same items shuffled into a random order', () => {
    const results = mocklify<IUser>()
      .addAll(MOCK_USERS)
      .getShuffled();

    expect(results.length).toBe(MOCK_USERS.length);
    expect(results).not.toEqual(MOCK_USERS);
  });
});
