import { GetUserByIdQuery } from '@shakala/backend-application';
import { factories } from '@shakala/backend-domain';

import { MockQueryBus, MockRequest } from '../../../test';

import { ExpressSessionAdapter } from './express-session.adapter';

describe('ExpressSessionAdapter', () => {
  const queryBus = new MockQueryBus();
  const session = new ExpressSessionAdapter(queryBus);

  const create = factories();

  const user = create.user();

  beforeEach(() => {
    queryBus.for(GetUserByIdQuery).return(user);
  });

  describe('getUser', () => {
    it('returns the authenticated user', async () => {
      const result = await session.getUser(new MockRequest().withSession({ userId: user.id }));

      expect(result).toEqual(user);
      expect(queryBus.lastQuery).toEqual(new GetUserByIdQuery(user.id));
    });

    it('returns nothing when the request is not authenticated', async () => {
      expect(await session.getUser(new MockRequest())).toBe(undefined);
    });
  });

  describe('setUser / unsetUser', () => {
    it("stores a user's id in the request's session", async () => {
      const request = new MockRequest();

      session.setUser(request, user);

      expect(request.session.userId).toEqual(user.id);
    });

    it("removes the user's id from the request's session", async () => {
      const request = new MockRequest().withSession({ userId: user.id });

      session.unsetUser(request);

      expect(request.session.userId).toBe(undefined);
    });
  });
});
