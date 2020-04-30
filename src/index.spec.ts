import { mocklify } from '.';
import { modify, omit, override } from './operators';
import { MOCK_USERS } from './test-data';

describe('getMany()', () => {

  it ('[] allows fetching all data', () => {
    const results = mocklify(MOCK_USERS).getMany().apply();
    expect(results).toEqual(MOCK_USERS);
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

  it ('[omit>modify>override] allows multiple operators to be applied as a chain', () => {
    const results = mocklify(MOCK_USERS).getMany(user => user.age > 40).apply(
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

  it ('[override>modify] applies operators in the correct order', () => {
    const overrideThenModify = mocklify(MOCK_USERS).getMany(user => user.age > 40).apply(
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




// it ('[where>omit>modify>override] allows a chain of operators (in the specified order)', () => {
  //   const results = mocklify(MOCK_USERS).getMany(
  //     where(user => user.age > 40),
  //     omit(['age']),
  //     modify((user, index) => {
  //       user.id = `user_${index}`;
  //       user.name = user.name.split(' ')?.[0];
  //     }),
  //     override({ isAdmin: true })
  //   );

  //   expect(results).toEqual([
  //     Object.assign({}, MOCK_USERS[2], {
  //       age: undefined,
  //       id: `user_0`,
  //       name: MOCK_USERS[2].name.split(' ')?.[0],
  //       isAdmin: true
  //     }),
  //   ]);
  // });

  // it ('[where>omit>modify>override] allows a chain of operators (in the specified order)', () => {

  //   const results = mocklify(MOCK_USERS).getMany(user => user.age > 35).apply(
  //     override({ isAdmin: true }),
  //     // where(nameStartsWithM, makeThemAnAdmin),
  //     // where(user => user.age < 10, makeThemAnAdmin)
  //   );

  //   expect(results).toEqual([
  //     MOCK_USERS[2]
  //   ]);
  // });


  // it ('[withSubset] allows application of a chain of operators selectively for subsets of the data', () => {
  //   const results = mocklify(MOCK_USERS).getMany(
  //     override({ isAdmin: true }),
  //     // withSubset({ toPecentage: 50 }, [
  //     //   override({ age: 3 }),
  //     //   modify(user => user.name = `Baby ${user.name}`)
  //     // ]),
  //   );
  //   expect(results).toEqual([
  //     Object.assign({}, MOCK_USERS[0], { isAdmin: true, age: 3 }),
  //     Object.assign({}, MOCK_USERS[1], { isAdmin: true, age: 3 }),
  //     Object.assign({}, MOCK_USERS[2], { isAdmin: true })
  //   ]);
  // })
})