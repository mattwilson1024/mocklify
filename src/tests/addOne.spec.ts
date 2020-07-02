import { mocklify } from '../main';
import { IUser, MOCK_USERS } from './test-data/test-data';

describe('addOne()', () => {

  it('adds a single item to the data set', () => {
    const harry = MOCK_USERS.find(user => user.firstName === 'Harry');

    const results = mocklify<IUser>()
      .addOne(harry)
      .getAll();

    expect(results.length).toBe(1);
    expect(results[0].firstName).toBe('Harry');
  });

  it('has no effect if passing null or undefined', () => {
    const results = mocklify<IUser>()
      .addOne(null)
      .addOne(undefined)
      .getAll();

    expect(results.length).toBe(0);
  });

});
