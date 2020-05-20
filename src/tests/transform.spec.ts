import { Limiter } from '../limiter';
import { mocklify } from '../main';
import { modify, omit, override } from '../operators';
import { where } from '../scopes';
import { IUser, MOCK_TAGS, MOCK_USERS } from './test-data/test-data';

describe('transform()', () => {

  it('[omit] should remove the specified properties from the results', () => {
    const results = mocklify<IUser>()
      .add(2, MOCK_USERS)
      .transform(
        omit(['isAdmin', 'isOnline'])
      )
      .getAll();

    expect(results).toEqual([
      Object.assign({}, MOCK_USERS[0], { isAdmin: undefined, isOnline: undefined }),
      Object.assign({}, MOCK_USERS[1], { isAdmin: undefined, isOnline: undefined }),
    ]);
  });

  it('[omit] should have no effect if no properties are provided', () => {
    const results = mocklify<IUser>()
      .addAll(MOCK_USERS)
      .transform(
        omit([])
      )
      .getAll();

    expect(results).toEqual(MOCK_USERS);
  });

  it('[override] allows overriding specific props of results', () => {
    const results = mocklify<IUser>()
      .addAll(MOCK_USERS)
      .transform(
        override({ points: 99 }),
      )
      .getAll();

      expect(results.every(user => user.points === 99));
  });

  it('[modify] allows immutable modification of results', () => {
    const results = mocklify<IUser>()
      .add(2, MOCK_USERS)
      .transform(
        modify((user, index) => {
          user.id = `user_${index}`;
          user.points *= 2;
        })
      )
      .getAll();

    expect(results).toEqual([
      Object.assign({}, MOCK_USERS[0], { id: `user_0`, points: MOCK_USERS[0].points * 2 }),
      Object.assign({}, MOCK_USERS[1], { id: `user_1`, points: MOCK_USERS[1].points * 2 }),
    ]);
  });

  it('[modify] modify callback provides the current item, its index and the full array of items', () => {
    const results = mocklify<IUser>()
      .add(2, MOCK_USERS)
      .transform(
        modify((user, index, allUsers) => {
          user.firstName = `${user.firstName} (user ${index + 1} of ${allUsers.length})`;
        })
      )
      .getAll();

    expect(results).toEqual([
      Object.assign({}, MOCK_USERS[0], { firstName: `${MOCK_USERS[0].firstName} (user 1 of 2)` }),
      Object.assign({}, MOCK_USERS[1], { firstName: `${MOCK_USERS[1].firstName} (user 2 of 2)` }),
    ]);
  });

  it('[omit > modify > override] allows multiple operators to be applied as a chain', () => {
    const results = mocklify<IUser>()
      .add(1, MOCK_USERS)
      .transform(
        omit(['isOnline']),
        modify((user, index) => {
          user.id = `user_${index}`;
          user.firstName = user.firstName.charAt(0).toUpperCase();
        }),
        override({ isAdmin: true })
      )
      .getAll()


    expect(results).toEqual([
      Object.assign<{}, IUser, Partial<IUser>>({}, MOCK_USERS[0], {
        isOnline: undefined,
        id: `user_0`,
        firstName: MOCK_USERS[0].firstName.charAt(0).toUpperCase(),
        isAdmin: true
      })
    ]);
  });

  it('[override > modify] applies operators in the correct order', () => {
    const overrideThenModify = mocklify<IUser>()
      .add(1, MOCK_USERS)
      .transform(
        override({ points: 20 }),
        modify(user => user.points *= 10)
      )
      .getAll();

    const modifyThenOverride = mocklify<IUser>()
      .add(1, MOCK_USERS)
      .transform(
        modify(user => user.points *= 10),
        override({ points: 20 }),
      )
      .getAll();

    expect(overrideThenModify).toEqual([
      Object.assign<{}, IUser, Partial<IUser>>({}, MOCK_USERS[0], { points: 20 * 10 })
    ]);

    expect(modifyThenOverride).toEqual([
      Object.assign<{}, IUser, Partial<IUser>>({}, MOCK_USERS[0], { points: 20 })
    ]);
  });

  it ('[omit > ~override > ~modify > ~omit] operators can be restricted to apply only on a subset of items', () => {
    const isGryffindor: Limiter<IUser> = user => user.tagIds.includes(MOCK_TAGS.gryffindor.id);
    const isSlytherin: Limiter<IUser> = user => user.tagIds.includes(MOCK_TAGS.slytherin.id);
    const isHarry: Limiter<IUser> = user => user.firstName === 'Harry' && user.lastName === 'Potter';

    const results = mocklify<IUser>()
      .addAll(MOCK_USERS)
      .transform(
        omit(['isOnline']),
        where(isGryffindor,
          override({ points: 1000 })
        ),
        where(isSlytherin,
          modify(user => user.points = 0)
        ),
        where(isHarry,
          override({
            points: 9000,
            isAdmin: true
          })
        )
      )
      .getAll();

    expect(results).toEqual(MOCK_USERS.map((user, index) => {
      let expectedPoints = user.points;
      let expectedIsAdmin = user.isAdmin;
      if (isGryffindor(user, index)) {
        expectedPoints = 1000;
      }
      if (isSlytherin(user, index)) {
        expectedPoints = 0;
      }
      if (isHarry(user, index)) {
        expectedPoints = 9000;
        expectedIsAdmin = true;
      }

      return Object.assign<{}, IUser, Partial<IUser>>({}, user, {
        isOnline: undefined,
        points: expectedPoints,
        isAdmin: expectedIsAdmin
      });
    }));
  });

});
