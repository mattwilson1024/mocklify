import { Mocklify } from './index';

interface IUser {
  id: string;
  name: string;
  age: number;
  isAdmin: boolean;
}

const MOCK_USERS: IUser[] = [
  {
    id: 'user1',
    name: 'Bob Bobson',
    age: 30,
    isAdmin: true, 
  },
  {
    id: 'user2',
    name: 'Frank Butterworth',
    age: 40,
    isAdmin: false
  },
  {
    id: 'user3',
    name: 'Sally Sausage',
    age: 50,
    isAdmin: false
  }
];

const MOCK_USER_FACTORY = new Mocklify<IUser>(MOCK_USERS);

describe('Mocklify -> getOne()', () => {

  it ('allows filtering based on a predicate function', () => {
    const result = MOCK_USER_FACTORY.getOne({
      where: user => user.age > 35
    });
    expect(result).toEqual(MOCK_USERS[1]);
  });

  it ('allows certain props to be omitted', () => {
    const result = MOCK_USER_FACTORY.getOne({
      omit: ['name', 'age']
    });
    expect(result).toEqual({ id: MOCK_USERS[0].id, isAdmin: MOCK_USERS[0].isAdmin });
  })

  it ('allows overriding props', () => {
    const result = MOCK_USER_FACTORY.getOne({
      override: {
        name: 'Overridden'
      }
    });
    expect(result).toEqual(Object.assign({}, MOCK_USERS[0], {
      name: 'Overridden'
    }));
  })

  it ('allows modification of item', () => {
    const result = MOCK_USER_FACTORY.getOne({
      modify: user => {
        user.age *= 2
      }
    });

    expect(result).toEqual(Object.assign({}, MOCK_USERS[0], {
      age: 60
    }));
  });

  it ('allows combination of where, omit, modify and override features (in that order)', () => {
    const result = MOCK_USER_FACTORY.getOne({
      where: user => user.age > 40,
      omit: ['age'],
      modify: user => {
        user.name = user.name.split(' ')?.[0];
      },
      override: {
        isAdmin: true
      },
    });

    expect(result).toEqual(Object.assign({}, MOCK_USERS[2], {
      age: undefined,
      name: 'Sally',
      isAdmin: true
    }));
  });



})