import { mocklify } from '.';
import { modify, omit, override, where } from './operators';
import { MOCK_USERS } from './test-data';

describe('getMany()', () => {

  it ('[where] allows filtering based on a predicate function', () => {
    const results = mocklify(MOCK_USERS).getMany(
      where(user => user.age > 35)
    );
    expect(results).toEqual([ MOCK_USERS[1], MOCK_USERS[2] ]);
  });

  it ('[omit] allows certain props to be omitted', () => {
    const results = mocklify(MOCK_USERS).getMany(
      omit(['name', 'age', 'isOnline'])
    );
    expect(results).toEqual([
      { id: MOCK_USERS[0].id, isAdmin: MOCK_USERS[0].isAdmin },
      { id: MOCK_USERS[1].id, isAdmin: MOCK_USERS[1].isAdmin },
      { id: MOCK_USERS[2].id, isAdmin: MOCK_USERS[2].isAdmin }
    ]);
  })

  it ('[override] allows overriding props', () => {
    const results = mocklify(MOCK_USERS).getMany(
      override({ age: 99 })
    );
    expect(results).toEqual([
      Object.assign({}, MOCK_USERS[0], { age: 99 }),
      Object.assign({}, MOCK_USERS[1], { age: 99 }),
      Object.assign({}, MOCK_USERS[2], { age: 99 })
    ]);
  })

  it ('[modify] allows items to be modified using a provided modifier function', () => {
    const results = mocklify(MOCK_USERS).getMany(
      modify(user => user.age *= 2)
    );

    expect(results).toEqual([
      Object.assign({}, MOCK_USERS[0], { age: MOCK_USERS[0].age * 2 }),
      Object.assign({}, MOCK_USERS[1], { age: MOCK_USERS[1].age * 2 }),
      Object.assign({}, MOCK_USERS[2], { age: MOCK_USERS[2].age * 2 }),
    ]);
  });

  it ('[where>omit>modify>override] allows a chain of operators (in the specified order)', () => {
    const results = mocklify(MOCK_USERS).getMany(
      where(user => user.age > 40),
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
})