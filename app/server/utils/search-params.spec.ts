import { SearchParams } from './search-params';

const createRequest = (url: string) => {
  return { url } as Request;
};

const createSearchParams = (params: string) => {
  return new SearchParams(createRequest('http://localhost' + params));
};

describe('SearchParams', () => {
  describe('getString', () => {
    it("retrieves a string value from a request's search params", () => {
      expect(createSearchParams('?search=science').getString('search')).toEqual('science');
    });

    it('returns undefined when the param does not exist', () => {
      expect(createSearchParams('?search=science').getString('sort')).toBeUndefined();
    });

    it('returns the first value when the param is an array', () => {
      expect(createSearchParams('?search=science&search=bitch').getString('search')).toEqual('science');
    });
  });

  describe('getEnum', () => {
    enum Sort {
      dateAsc = 'date-asc',
      relevance = 'relevance',
    }

    it("retrieves an enum value from a request's search params", () => {
      expect(createSearchParams('?sort=date-asc').getEnum('sort', Sort)).toEqual(Sort.dateAsc);
    });

    it('returns undefined when the param does not exist', () => {
      expect(createSearchParams('?sort=date-asc').getEnum('search', Sort)).toBeUndefined();
    });

    it('returns undefined when the param is not an existing enum value', () => {
      expect(createSearchParams('?sort=date-desc').getEnum('sort', Sort)).toBeUndefined();
    });

    it('returns the first value when the param is an array', () => {
      expect(createSearchParams('?sort=date-asc&sort=relevance').getEnum('sort', Sort)).toEqual('date-asc');
    });
  });
});
