import { IUser, MOCK_USERS } from "./test-data/test-data";
import { AddPredicate, mocklify } from "../main";

describe('terminators', () => {

  it('[getAll] gets all the updated results', () => {
    const results: IUser[] = mocklify<IUser>()
      .addAll(MOCK_USERS)
      .getAll();

    expect(results.length).toEqual(MOCK_USERS.length);
  });

  it('[getFirst] gets the first item of the updated results', () => {
    const result: IUser = mocklify<IUser>()
      .addAll(MOCK_USERS)
      .getFirst();

    expect(result).toEqual(MOCK_USERS[0]);
  });

  it('[getLast] gets the last item of the updated results', () => {
    const result: IUser = mocklify<IUser>()
      .addAll(MOCK_USERS)
      .getLast();

    const lastIndex = MOCK_USERS.length - 1;
    expect(result).toEqual(MOCK_USERS[lastIndex]);
  });

  it('[get] gets the first n results', () => {
    const results: IUser[] = mocklify<IUser>()
      .addAll(MOCK_USERS)
      .get(10);

    const firstTenUsers = MOCK_USERS.slice(0, 10);
    expect(results).toEqual(firstTenUsers);
  });

  it('[get] if the number is greater than the length of the results should return all it can but not pad or dupe', () => {
    const results: IUser[] = mocklify<IUser>()
      .addAll(MOCK_USERS)
      .get(500);

    const firstTenUsers = MOCK_USERS;
    expect(results).toEqual(MOCK_USERS);
  });

  it('[getOne] return first item that matches the predicate', () => {
    const whereNameIsPotter: AddPredicate<IUser> = user => user.lastName === 'Potter';

    const result: IUser | undefined = mocklify<IUser>()
      .addAll(MOCK_USERS)
      .getOne(whereNameIsPotter);

    expect(result).not.toBeUndefined()
    if (result) expect(result.firstName).toEqual('Harry');
  });

  it('[getOne] returns undefined if the predicate is not matched', () => {
    const whereNameDoesNotExist: AddPredicate<IUser> = user => user.lastName === 'Non Existent Character';

    const result: IUser | undefined = mocklify<IUser>()
      .addAll(MOCK_USERS)
      .getOne(whereNameDoesNotExist);

    expect(result).toBeUndefined()
  });
});
