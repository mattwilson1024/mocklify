import { mocklify } from '.';
import { MOCK_USERS, UserFactory } from './test-data';
import { omit } from "./operators";

describe('generate()', () => {

    it ('returns the number of items asked for', () => {
        const results = mocklify(MOCK_USERS)
            .generate(50, UserFactory)
            .apply();

        expect(results).toHaveLength(50);
    });

    it ('uses the real mock data first', () => {
        const results = mocklify(MOCK_USERS)
            .generate(10, UserFactory)
            .apply();

        expect(results[0]).toEqual(MOCK_USERS[0]);
        expect(results[1]).toEqual(MOCK_USERS[1]);
        expect(results[2]).toEqual(MOCK_USERS[2]);
        expect(results[3].id).toEqual('userX');
    });

    it ('can still use apply after', () => {
        const results = mocklify(MOCK_USERS)
            .generate(10, UserFactory)
            .apply(
                omit(['age'])
            );

        expect(results[0].age).toEqual(undefined);
        expect(results[3].age).toEqual(undefined);
    });
})
