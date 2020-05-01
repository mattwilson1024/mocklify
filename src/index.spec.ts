import { mocklify } from '.';
import { Limiter } from './limiter';
import { modify, omit, override } from './operators';
import { where } from './scopes';
import { IUser, MOCK_USERS } from './test-data';

describe('getMany()', () => {

  it ('[] allows fetching all data', () => {
    const results = mocklify(MOCK_USERS).getMany().apply();
    expect(results).toEqual(MOCK_USERS);[]
  });

  it ('[] allows data to be filtered by a predicate', () => {
    const results = mocklify(MOCK_USERS).getMany(user => user.age > 35).apply();

    expect(results).toEqual([ MOCK_USERS[1], MOCK_USERS[2] ]);
  });

  it ('[omit] allows specific props to be omitted from results', () => {
    const results = mocklify(MOCK_USERS).getMany(user => user.age > 35).apply(
      omit(['age', 'isAdmin'])
    );

    expect(results).toEqual([
      Object.assign({}, MOCK_USERS[1], { age: undefined, isAdmin: undefined }),
      Object.assign({}, MOCK_USERS[2], { age: undefined, isAdmin: undefined }),
    ]);
  });

  it ('[override] allows overriding specific props of results', () => {
    const results = mocklify(MOCK_USERS).getMany(user => user.age > 35).apply(
      override({ age: 99 }),
    );

    expect(results).toEqual([
      Object.assign({}, MOCK_USERS[1], { age: 99 }),
      Object.assign({}, MOCK_USERS[2], { age: 99 }),
    ]);
  });

  it ('[modify] allows immutable modification of results', () => {
    const results = mocklify(MOCK_USERS).getMany(user => user.age > 35).apply(
      modify((user, index) => {
        user.id = `user_${index}`;
        user.age *= 2;
      })
    );

    expect(results).toEqual([
      Object.assign({}, MOCK_USERS[1], { id: 'user_0', age: MOCK_USERS[1].age * 2 }),
      Object.assign({}, MOCK_USERS[2], { id: 'user_1', age: MOCK_USERS[2].age * 2 }),
    ]);
  });

  it('[omit > modify > override] allows multiple operators to be applied as a chain', () => {
    const results = mocklify(MOCK_USERS)
      .getMany(user => user.age > 40)
      .apply(
        omit(['age']),
        modify((user, index) => {
          user.id = `user_${index}`;
          user.name = user.name.split(' ')?.[0];
        }),
        override({ isAdmin: true })
      );

    expect(results).toEqual([
      Object.assign({}, MOCK_USERS[2], {
        age: undefined,
        id: `user_0`,
        name: MOCK_USERS[2].name.split(' ')?.[0],
        isAdmin: true
      }),
    ]);
  });

  it ('[override > modify] applies operators in the correct order', () => {
    const overrideThenModify = mocklify(MOCK_USERS)
    .getMany(user => user.age > 40)
    .apply(
      override({ age: 20 }),
      modify(user => user.age *= 7)
    );

    const modifyThenOverride = mocklify(MOCK_USERS).getMany(user => user.age > 40).apply(
      modify(user => user.age *= 7),
      override({ age: 20 }),
    );

    expect(overrideThenModify).toEqual([
      Object.assign({}, MOCK_USERS[2], { age: 20 * 7 })
    ]);

    expect(modifyThenOverride).toEqual([
      Object.assign({}, MOCK_USERS[2], { age: 20 })
    ]);
  });

  it ('[omit > ~override > ~modify > ~omit] operators can be restricted to apply only on a subset of items', () => {
    const isWithinFirstTwoUsers: Limiter<IUser> = (user, index) => index >= 0 && index <= 1;
    const isThirdUser: Limiter<IUser> = (user, index) => index === 2;
    const isBob: Limiter<IUser> = (user, index) => user.name === 'Bob Bobson';

    const results = mocklify(MOCK_USERS).getMany().apply(
      omit(['isAdmin']),
      where(isWithinFirstTwoUsers, [
        override({ age: 88 })
      ]),
      where(isThirdUser, [
        modify(user => user.age = 99)
      ]),
      where(isBob, [
        omit(['isOnline'])
      ])
    );

    expect(results).toEqual([
      Object.assign({}, MOCK_USERS[0], { isAdmin: undefined, age: 88, isOnline: undefined }),
      Object.assign({}, MOCK_USERS[1], { isAdmin: undefined, age: 88 }),
      Object.assign({}, MOCK_USERS[2], { isAdmin: undefined, age: 99 }),
    ]);
  });
})