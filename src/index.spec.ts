import { Mocklify } from '.';
import { modify, omit, override, where } from './operators';

interface IUser {
  id: string;
  name: string;
  age: number;
  isAdmin: boolean;
  isOnline: boolean;
}

const MOCK_USERS: IUser[] = [
  {
    id: 'user1',
    name: 'Bob Bobson',
    age: 30,
    isAdmin: true,
    isOnline: false
  },
  {
    id: 'user2',
    name: 'Frank Butterworth',
    age: 40,
    isAdmin: false,
    isOnline: false
  },
  {
    id: 'user3',
    name: 'Sally Sausage',
    age: 50,
    isAdmin: false,
    isOnline: false
  }
];

const MOCK_USER_FACTORY = new Mocklify<IUser>(MOCK_USERS);

describe('Mocklify -> getOne()', () => {

  it ('[where] allows filtering based on a predicate function', () => {
    const results = MOCK_USER_FACTORY.getMany(
      where(user => user.age > 35)
    );
    expect(results).toEqual([ MOCK_USERS[1], MOCK_USERS[2] ]);
  });

  it ('[omit] allows certain props to be omitted', () => {
    const results = MOCK_USER_FACTORY.getMany(
      omit(['name', 'age', 'isOnline'])
    );
    expect(results).toEqual([
      { id: MOCK_USERS[0].id, isAdmin: MOCK_USERS[0].isAdmin },
      { id: MOCK_USERS[1].id, isAdmin: MOCK_USERS[1].isAdmin },
      { id: MOCK_USERS[2].id, isAdmin: MOCK_USERS[2].isAdmin }
    ]);
  })

  it ('allows overriding props', () => {
    const results = MOCK_USER_FACTORY.getMany(
      override({ age: 99 })
    );
    expect(results).toEqual([
      Object.assign({}, MOCK_USERS[0], { age: 99 }),
      Object.assign({}, MOCK_USERS[1], { age: 99 }),
      Object.assign({}, MOCK_USERS[2], { age: 99 })
    ]);
  })

  it ('[modify] allows items to be modified using a provided modifier function', () => {
    const results = MOCK_USER_FACTORY.getMany(
      modify(user => user.age *= 2)
    );

    expect(results).toEqual([
      Object.assign({}, MOCK_USERS[0], { age: MOCK_USERS[0].age * 2 }),
      Object.assign({}, MOCK_USERS[1], { age: MOCK_USERS[1].age * 2 }),
      Object.assign({}, MOCK_USERS[2], { age: MOCK_USERS[2].age * 2 }),
    ]);
  });

  it ('allows combination of where, omit, modify and override features (in the specified order)', () => {
    const results = MOCK_USER_FACTORY.getMany(
      where(user => user.age > 40),
      omit(['age']),
      modify((user, index) => {
        user.id = `user_${index}`;
        user.name = user.name.split(' ')?.[0];
      }),
      override({ isAdmin: true })
      // override({ isAdmin: true }, { from: 0, to: 10 }),
      // override({ isAdmin: false }, { from: 11 }),
      // override({ isOnline: true }, { random: 75 })
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