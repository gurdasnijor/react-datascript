import expect from 'expect';
import parseQueryAttributes from '../src/parseQueryAttributes';


describe('Utils', () => {
  describe.skip('parseQueryAttributes', () => {
    const query = `[:find ?user1 ?user2
                    :in $ %
                    :where (follows ?u1 ?u2)
                           [?u1 "name" ?user1]
                           [?u2 "name" ?user2]]`;

    it('parses relevant attributes', () => {
      const attrMap = parseQueryAttributes(query);
      expect(attrMap).toEqual({ name: true });
    });
  });
});
