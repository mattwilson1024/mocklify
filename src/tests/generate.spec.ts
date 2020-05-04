import { mocklify } from '../main';
import { IUser, MOCK_USER_FACTORY } from './test-data/test-data';

describe('generate()', () => {

  it('should generate n items using a specified factory function', () => {
    const users = MOCK_USER_FACTORY;

    const results = mocklify<IUser>()
      .generate(3, users)
      .getAll();

    expect(results.length).toBe(3);
    expect(results).toEqual([
      MOCK_USER_FACTORY(0),
      MOCK_USER_FACTORY(1),
      MOCK_USER_FACTORY(2)
    ]);
  });

  it('should have no effect if the number passed in is less than 1', () => {
    const users = MOCK_USER_FACTORY;

    const resultsZero = mocklify<IUser>()
      .generate(0, users)
      .getAll();

    const resultsNegative = mocklify<IUser>()
      .generate(-1, users)
      .getAll();

    expect(resultsZero).toEqual([]);
    expect(resultsNegative).toEqual([]);
  });

});
