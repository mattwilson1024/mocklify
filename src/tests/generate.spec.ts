import { mocklify } from '../main';
import { modify } from '../operators';
import { IUser, MOCK_USER_FACTORY, PARTIAL_MOCK_USER_FACTORY } from './test-data/test-data';

describe('generate()', () => {

  it('[generate] should generate n items using a specified factory function', () => {
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

  it('[generate] should have no effect if the number passed in is less than 1', () => {
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

  it('[generatePartial] should allow generation of n partial items, using a specified factory function', () => {
    const users = PARTIAL_MOCK_USER_FACTORY;

    const results = mocklify<IUser>()
      .generatePartial(3, users)
      .transform(
        modify((user, index) => user.firstName = `Generated User ${index + 1}`)
      )
      .getAll();

    expect(results.length).toBe(3);
    expect(results).toEqual([
      Object.assign({}, PARTIAL_MOCK_USER_FACTORY(0), { firstName: `Generated User 1` }),
      Object.assign({}, PARTIAL_MOCK_USER_FACTORY(1), { firstName: `Generated User 2` }),
      Object.assign({}, PARTIAL_MOCK_USER_FACTORY(2), { firstName: `Generated User 3` }),
    ]);
  });

});
