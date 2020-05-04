export interface IUser {
  id: string;
  name: string;
  age: number;
  isAdmin: boolean;
  isOnline: boolean;
}

export const MOCK_USERS: IUser[] = [
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

export function UserFactory(): IUser {
  return {
    id: 'userX',
    name: 'bill',
    age: 22,
    isAdmin: false,
    isOnline: false
  }
}
