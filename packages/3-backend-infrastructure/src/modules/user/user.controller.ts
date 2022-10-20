import { AuthorizationError, GetProfileImageQuery, GetUserByIdQuery, LoggerPort } from 'backend-application';
import { GetUserActivitiesQuery } from 'backend-application/src/modules/user/get-user-activities/get-user-activities.query';
import { Paginated, PaginationError } from 'backend-application/src/utils/pagination';
import { ProfileImageData, User, UserActivity } from 'backend-domain';
import { AuthorizationErrorReason, UserDto } from 'shared';

import {
  BadRequest,
  Controller,
  NotFound,
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

  endpoints(): Record<string, RequestHandler> {
    return {
      'GET /activities': this.listUserActivities,
      'GET /profile-image/:image': this.getProfileImage,
      'GET /:userId': this.getUser,
    };
  }

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

    try {
      const { items, total } = await this.queryBus.execute<Paginated<UserActivity>>(
        new GetUserActivitiesQuery(userId, pagination),
      );

      return Response.paginated(items.map(UserActivityPresenter.transform), total);
    } catch (error) {
      if (error instanceof PaginationError) {
        throw new BadRequest('PaginationError', error.message, error.details);
      }

      throw error;
    }
  }
}
