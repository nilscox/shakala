import {
  ExecutionContext,
  GetUserByIdQuery,
  InMemoryNotificationRepository,
  MarkNotificationAsSeenCommand,
  UpdateUserCommand,
} from 'backend-application';
import { factories, Notification, ProfileImageType } from 'backend-domain';
import { NotificationType } from 'shared';

import { BadRequest, RequestFile, StubConfigAdapter, ValidationService } from '../../infrastructure';
import { MockLoggerAdapter } from '../../infrastructure/test';
import { MockCommandBus, MockQueryBus, MockRequest, StubSessionAdapter } from '../../test';
import { UserPresenter } from '../user/user.presenter';

import { AccountController } from './account.controller';

describe('AccountController', () => {
  const commandBus = new MockCommandBus();
  const queryBus = new MockQueryBus();
  const notificationRepository = new InMemoryNotificationRepository();
  const session = new StubSessionAdapter();
  const config = new StubConfigAdapter({ app: { apiBaseUrl: 'http://api.url' } });

  const controller = new AccountController(
    new MockLoggerAdapter(),
    commandBus,
    queryBus,
    notificationRepository,
    session,
    new ValidationService(),
    new UserPresenter(config),
  );

  const create = factories();

  const user = create.user();
  const ctx = ExecutionContext.as(user);

  describe('getNotifications', () => {
    beforeEach(() => {
      session.user = user;
    });

    it("retrieves the user's notifications", async () => {
      const notification = new Notification({
        id: create.id(),
        date: create.timestamp(),
        userId: user.id,
        type: NotificationType.rulesUpdated,
        payload: { version: 'version', changes: 'changes' },
      });

      notificationRepository.add(notification);

      const response = await controller.getNotifications(new MockRequest());

      expect(response).toHaveStatus(200);
      expect(response).toHaveHeader('Pagination-Total', '1');
      expect(response).toHaveBody([
        {
          id: notification.id,
          seen: false,
          date: notification.date.toString(),
          type: NotificationType.rulesUpdated,
          payload: { version: 'version', changes: 'changes' },
        },
      ]);
    });
  });

  describe('getUnseenNotificationsCount', () => {
    beforeEach(() => {
      session.user = user;
    });

    it("retrieves the user's total number of unseen notifications", async () => {
      const notification = new Notification({
        id: create.id(),
        date: create.timestamp(),
        seenDate: undefined,
        userId: user.id,
        type: NotificationType.rulesUpdated,
        payload: { version: 'version', changes: 'changes' },
      });

      notificationRepository.add(notification);

      const response = await controller.getUnseenNotificationsCount(new MockRequest());

      expect(response).toHaveStatus(200);
      expect(response).toHaveBody(1);
    });
  });

  describe('markNotificationAsSeen', () => {
    beforeEach(() => {
      session.user = user;
    });

    it('marks a notification as seen by the user', async () => {
      const notification = Notification.create(NotificationType.rulesUpdated, {
        id: create.id(),
        date: create.timestamp(),
        seenDate: undefined,
        userId: user.id,
        payload: { version: 'version', changes: 'changes' },
      });

      notificationRepository.add(notification);

      const response = await controller.markNotificationAsSeen(
        new MockRequest().withParam('notificationId', notification.id),
      );

      expect(response).toHaveStatus(204);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new MarkNotificationAsSeenCommand(notification.id),
        ExecutionContext.as(user),
      );
    });
  });

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
