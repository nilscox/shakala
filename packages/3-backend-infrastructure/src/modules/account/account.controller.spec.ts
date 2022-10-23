import { ExecutionContext, GetUserByIdQuery, UpdateUserCommand } from 'backend-application';
import { factories, ProfileImageType } from 'backend-domain';

import { BadRequest, RequestFile, StubConfigAdapter } from '../../infrastructure';
import { MockLoggerAdapter } from '../../infrastructure/test';
import { MockCommandBus, MockQueryBus, MockRequest, StubSessionAdapter } from '../../test';
import { UserPresenter } from '../user/user.presenter';

import { AccountController } from './account.controller';

describe('AccountController', () => {
  const commandBus = new MockCommandBus();
  const queryBus = new MockQueryBus();
  const session = new StubSessionAdapter();
  const config = new StubConfigAdapter({ app: { apiBaseUrl: 'http://api.url' } });

  const controller = new AccountController(
    new MockLoggerAdapter(),
    commandBus,
    queryBus,
    session,
    new UserPresenter(config),
  );

  const create = factories();

  const user = create.user();
  const ctx = ExecutionContext.as(user);

  describe('changeProfileImage', () => {
    beforeEach(() => {
      session.user = user;
    });

    it("changes the user's profile image", async () => {
      const file: RequestFile = {
        name: 'file name',
        data: Buffer.from('file data'),
        type: 'image/jpeg',
      };

      queryBus
        .for(GetUserByIdQuery)
        .return(create.user({ ...user, profileImage: create.profileImage('image-name.png') }));

      const response = await controller.changeProfileImage(new MockRequest().withFile(file));

      expect(response).toHaveStatus(200);
      expect(response).toHaveBody('http://api.url/user/profile-image/image-name.png');

      expect(commandBus.execute).toHaveBeenCalledWith(
        new UpdateUserCommand({
          profileImage: create.profileImageData({ type: ProfileImageType.jpg, data: file.data }),
        }),
        ctx,
      );
    });

    it("removes the user's profile image", async () => {
      queryBus.for(GetUserByIdQuery).return(create.user({ ...user, profileImage: null }));

      const response = await controller.changeProfileImage(new MockRequest());

      expect(response).toHaveStatus(204);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new UpdateUserCommand({ profileImage: undefined }),
        ctx,
      );
    });

    it("fails when the image's mime type is not known", async () => {
      const file: RequestFile = {
        name: 'file name',
        type: 'image/webp',
        data: Buffer.from('file data'),
      };

      const request = new MockRequest().withFile(file);

      const error = await expect.rejects(controller.changeProfileImage(request)).with(BadRequest);

      expect(error.body).toEqual({
        code: 'InvalidImageFormat',
        message: expect.any(String),
        details: {
          type: 'image/webp',
          allowedTypes: ['image/png', 'image/jpg', 'image/jpeg', 'image/bmp'],
        },
      });
    });
  });
});
