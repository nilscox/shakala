import { ExecutionContext, GetUserByIdQuery, LoggerService, UpdateUserCommand } from 'backend-application';
import { ProfileImageData, ProfileImageType, User } from 'backend-domain';
import multer, { memoryStorage } from 'multer';

import {
  BadRequest,
  CommandBus,
  Controller,
  Middlewares,
  QueryBus,
  Request,
  RequestHandler,
  Response,
  SessionService,
} from '../../infrastructure';
import { UserPresenter } from '../user/user.presenter';

const storage = memoryStorage();
const upload = multer({ storage: storage });

export class AccountController extends Controller {
  constructor(
    logger: LoggerService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly sessionService: SessionService,
    private readonly userPresenter: UserPresenter,
  ) {
    super(logger, '/account');
  }

  endpoints(): Record<string, RequestHandler> {
    return {
      'POST /profile-image': this.changeProfileImage,
    };
  }

  @Middlewares(upload.single('profileImage'))
  async changeProfileImage(req: Request): Promise<Response<string | undefined>> {
    const user = await this.sessionService.getUser(req);

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
      throw new BadRequest('InvalidImageFormat', "the image's mime type is not recognized", {
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
