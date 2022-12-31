import {
  ExecutionContext,
  GetUserByIdQuery,
  LoggerPort,
  MarkNotificationAsSeenCommand,
  NotificationRepository,
  Pagination,
  UpdateUserCommand,
} from '@shakala/backend-application';
import { Notification, ProfileImageData, ProfileImageType, User } from '@shakala/backend-domain';
import multer, { memoryStorage } from 'multer';
import {
  AuthorizationError,
  AuthorizationErrorReason,
  InvalidImageFormat,
  NotificationDto,
  NotificationType,
} from '@shakala/shared';

import {
  CommandBus,
  Controller,
  Middlewares,
  QueryBus,
  Request,
  RequestHandler,
  Response,
  SessionPort,
  ValidationService,
} from '../../infrastructure';
import { execute } from '../../utils';
import { UserPresenter } from '../user/user.presenter';

const storage = memoryStorage();
const upload = multer({ storage: storage });

export class AccountController extends Controller {
  constructor(
    logger: LoggerPort,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly notificationRepository: NotificationRepository,
    private readonly session: SessionPort,
    private readonly validationService: ValidationService,
    private readonly userPresenter: UserPresenter,
  ) {
    super(logger, '/account');
  }

  endpoints(): Record<string, RequestHandler> {
    return {
      'GET /notifications/count': this.getUnseenNotificationsCount,
      'GET /notifications': this.getNotifications,
      'PUT /notifications/:notificationId/seen': this.markNotificationAsSeen,
      'POST /profile-image': this.changeProfileImage,
    };
  }

  async getUnseenNotificationsCount(req: Request): Promise<Response<number>> {
    const user = await this.session.getUser(req);

    if (!user) {
      throw new AuthorizationError(AuthorizationErrorReason.unauthenticated);
    }

    const count = await this.notificationRepository.countUnseenForUser(user.id);

    return Response.ok(count);
  }

  async getNotifications(req: Request): Promise<Response<NotificationDto[]>> {
    const user = await this.session.getUser(req);
    const pagination = await this.validationService.pagination(req);

    if (!user) {
      throw new AuthorizationError(AuthorizationErrorReason.unauthenticated);
    }

    const { items, total } = await this.notificationRepository.findForUser(
      user.id,
      Pagination.from(pagination),
    );

    return Response.paginated(items.map(this.transformNotification), total);
  }

  async markNotificationAsSeen(req: Request): Promise<Response> {
    const user = await this.session.getUser(req);
    const notificationId = req.params.get('notificationId') as string;

    if (!user) {
      throw new AuthorizationError(AuthorizationErrorReason.unauthenticated);
    }

    await execute(this.commandBus)
      .command(new MarkNotificationAsSeenCommand(notificationId))
      .asUser(user)
      .run();

    return Response.noContent();
  }

  private transformNotification(notification: Notification): NotificationDto<NotificationType> {
    return {
      id: notification.id,
      seen: notification.seenDate?.toString() ?? false,
      date: notification.date.toString(),
      type: notification.type,
      payload: notification.payload,
    };
  }

  @Middlewares(upload.single('profileImage'))
  async changeProfileImage(req: Request): Promise<Response<string | undefined>> {
    const user = await this.session.getUser(req);

    await this.commandBus.execute(
      new UpdateUserCommand({
        profileImage: this.getProfileImage(req),
      }),
      new ExecutionContext(user),
    );

    const { id: userId } = user as User;
    const updatedUser = await this.queryBus.execute<User>(new GetUserByIdQuery(userId));

    if (!updatedUser.profileImage) {
      return Response.noContent();
    }

    const userDto = await this.userPresenter.transformUser(updatedUser);

    return Response.ok(userDto.profileImage);
  }

  private getProfileImage(req: Request): ProfileImageData | undefined {
    if (!req.file) {
      return undefined;
    }

    const typesMap = {
      'image/png': ProfileImageType.png,
      'image/jpg': ProfileImageType.jpg,
      'image/jpeg': ProfileImageType.jpg,
      'image/bmp': ProfileImageType.bmp,
    };

    const type = typesMap[req.file.type as keyof typeof typesMap];

    if (!type) {
      throw new InvalidImageFormat({
        type: req.file.type,
        allowedTypes: Object.keys(typesMap),
      });
    }

    return new ProfileImageData({
      type,
      data: req.file.data,
    });
  }
}
