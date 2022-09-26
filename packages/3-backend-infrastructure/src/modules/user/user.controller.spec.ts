import { GetProfileImageQuery, GetUserByIdQuery } from 'backend-application';
import { factories, ProfileImageType } from 'backend-domain';

import { MockLoggerAdapter, StubConfigAdapter } from '../../infrastructure';
import { MockQueryBus, MockRequest, StubSessionAdapter } from '../../test';

import { UserController } from './user.controller';
import { UserPresenter } from './user.presenter';

describe('UserController', () => {
  const queryBus = new MockQueryBus();
  const session = new StubSessionAdapter();
  const config = new StubConfigAdapter({ app: { apiBaseUrl: 'http://api.url' } });

  const controller = new UserController(new MockLoggerAdapter(), queryBus, new UserPresenter(config));

  const create = factories();

  const user = create.user({
    id: 'userId',
    nick: create.nick('nick'),
    profileImage: create.profileImage('image.png'),
  });

  describe('getUser', () => {
    beforeEach(() => {
      session.user = user;
    });

    it('retrieves a user', async () => {
      queryBus.for(GetUserByIdQuery).return(user);

      const response = await controller.getUser(new MockRequest().withParam('userId', user.id));

      expect(response).toHaveStatus(200);
      expect(response).toHaveBody({
        id: 'userId',
        nick: 'nick',
        profileImage: 'http://api.url/user/profile-image/image.png',
      });
    });
  });

  describe('getProfileImage', () => {
    beforeEach(() => {
      session.user = user;
    });

    it('retrieves a user', async () => {
      const data = Buffer.from('image data');
      const image = create.profileImageData({ type: ProfileImageType.jpg, data });

      queryBus.for(GetProfileImageQuery).return(image);

      const response = await controller.getProfileImage(new MockRequest().withParam('image', 'image.png'));

      expect(queryBus.lastQuery).toEqual(new GetProfileImageQuery('image.png'));

      expect(response).toHaveStatus(200);
      expect(response).toHaveHeader('Content-Type', 'image/jpg');
      expect(response).toHaveBody(data);
    });
  });
});
