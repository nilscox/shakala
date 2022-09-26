import { GetProfileImageQuery, GetUserByIdQuery, LoggerPort } from 'backend-application';
import { ProfileImageData, User } from 'backend-domain';

import { Controller, NotFound, QueryBus, Request, RequestHandler, Response } from '../../infrastructure';

import { UserPresenter } from './user.presenter';

export class UserController extends Controller {
  constructor(
    logger: LoggerPort,
    private readonly queryBus: QueryBus,
    private readonly userPresenter: UserPresenter,
  ) {
    super(logger, '/user');
  }

  endpoints(): Record<string, RequestHandler> {
    return {
      'GET /:userId': this.getUser,
      'GET /profile-image/:image': this.getProfileImage,
    };
  }

  async getUser(req: Request): Promise<Response> {
    const userId = req.params.get('userId') as string;
    const user = await this.queryBus.execute<User | undefined>(new GetUserByIdQuery(userId));

    if (!user) {
      throw new NotFound('user not found', { userId });
    }

    return Response.ok(this.userPresenter.transformUser(user));
  }

  async getProfileImage(req: Request): Promise<Response> {
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
}
