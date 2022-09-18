import { GetUserByIdQuery } from 'backend-application';
import { factories } from 'backend-domain';

import { MockQueryBus, MockRequest } from '../../../test';

import { ExpressSessionService } from './session.service';

describe('ExpressSessionService', () => {
  const queryBus = new MockQueryBus();
  const service = new ExpressSessionService(queryBus);

  const create = factories();

  const user = create.user();

  beforeEach(() => {
    queryBus.for(GetUserByIdQuery).return(user);
  });

  describe('getUser', () => {
    it('returns the authenticated user', async () => {
      const result = await service.getUser(new MockRequest().withSession({ userId: user.id }));

      expect(result).toEqual(user);
      expect(queryBus.lastQuery).toEqual(new GetUserByIdQuery(user.id));
    });

    it('returns nothing when the request is not authenticated', async () => {
      expect(await service.getUser(new MockRequest())).toBeUndefined();
    });
  });

  describe('setUser / unsetUser', () => {
    it("stores a user's id in the request's session", async () => {
      const request = new MockRequest();

      service.setUser(request, user);

      expect(request.session.userId).toEqual(user.id);
    });

    it("removes the user's id from the request's session", async () => {
      const request = new MockRequest().withSession({ userId: user.id });

      service.unsetUser(request);

      expect(request.session.userId).toBeUndefined();
    });
  });
});
