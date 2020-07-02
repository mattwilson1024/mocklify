import { mocklify } from '../main';
import { IUser, MOCK_USERS } from './test-data/test-data';

describe('addOne()', () => {

  it('adds a single item to the data set', () => {
    const user = MOCK_USERS[0];

    const results = mocklify<IUser>()
      .addOne(user)
      .getAll();

    expect(results.length).toBe(1);
    expect(results[0].firstName).toBe(MOCK_USERS[0].firstName);
  });

});
