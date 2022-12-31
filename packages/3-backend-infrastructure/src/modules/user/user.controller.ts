import {
  GetProfileImageQuery,
  GetUserByIdQuery,
  LoggerPort,
  GetUserActivitiesQuery,
  Paginated,
} from '@shakala/backend-application';
import { ProfileImageData, User, UserActivity } from '@shakala/backend-domain';
import { AuthorizationError, AuthorizationErrorReason, NotFound, UserDto } from '@shakala/shared';

import {
  Controller,
  QueryBus,
  Request,
  RequestHandler,
  Response,
  ValidationService,
} from '../../infrastructure';

import { UserActivityPresenter } from './user-activity.presenter';
import { UserPresenter } from './user.presenter';

export class UserController extends Controller {
  constructor(
    logger: LoggerPort,
    private readonly queryBus: QueryBus,
    private readonly validationService: ValidationService,
    private readonly userPresenter: UserPresenter,
  ) {
    super(logger, '/user');
  }

  /* eslint-disable @typescript-eslint/unbound-method */
  endpoints(): Record<string, RequestHandler> {
    return {
      'GET /activities': this.listUserActivities,
      'GET /profile-image/:image': this.getProfileImage,
      'GET /:userId': this.getUser,
    };
  }
  /* eslint-enable @typescript-eslint/unbound-method */

  async getUser(req: Request): Promise<Response<UserDto>> {
    const userId = req.params.get('userId') as string;
    const user = await this.queryBus.execute<User | undefined>(new GetUserByIdQuery(userId));

    if (!user) {
      throw new NotFound('user not found', { userId });
    }

    return Response.ok(this.userPresenter.transformUser(user));
  }

  async getProfileImage(req: Request): Promise<Response<Buffer>> {
    const imageName = req.params.get('image') as string;

    const image = await this.queryBus.execute<ProfileImageData | undefined>(
      new GetProfileImageQuery(imageName),
    );

    if (!image) {
      throw new NotFound('profile image not found', { imageName });
    }

    const response = Response.ok(image.data);

    response.headers.set('Content-Type', `image/${image.type}`);

    return response;
  }

  async listUserActivities(req: Request): Promise<Response> {
    const userId = req.session.userId;
    const pagination = await this.validationService.pagination(req);

    if (!userId) {
      throw new AuthorizationError(AuthorizationErrorReason.unauthenticated);
    }

    const { items, total } = await this.queryBus.execute<Paginated<UserActivity>>(
      new GetUserActivitiesQuery(userId, pagination),
    );

    return Response.paginated(items.map(UserActivityPresenter.transform), total);
  }
}
