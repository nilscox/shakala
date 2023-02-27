import assert from 'assert';

import {
  InvalidEmailValidationTokenError,
  USER_TOKENS,
  ValidateUserEmailCommand,
  ValidateUserEmailHandler,
  UserRepository,
} from '@shakala/user';
import { injected } from 'brandi';
import { RequestHandler, Router } from 'express';

import { isAuthenticated } from '../infrastructure/guards';
import { jwt } from '../utils/jwt';

export class UserController {
  public readonly router: Router = Router();

  constructor(
    private readonly userRepository: UserRepository,
    private readonly validateUserEmailHandler: ValidateUserEmailHandler
  ) {
    this.router.get('/', isAuthenticated, this.getUserProfile);
    this.router.get('/validate-email/:token', isAuthenticated, this.validateEmail);
  }

  getUserProfile: RequestHandler = async (req, res) => {
    const cookies = req.cookies as Record<string, string>;
    const { uid: userId } = jwt.decode<{ uid: string }>(cookies.token);

    const user = await this.userRepository.findById(userId);

    // todo: handle not found errors
    assert(user, 'expected user to exist');

    // todo: query
    res.json({
      id: user.id,
      email: user.email,
    });

    res.end();
  };

  validateEmail: RequestHandler<{ token: string }> = async (req, res) => {
    const cookies = req.cookies as Record<string, string>;
    const { uid: userId } = jwt.decode<{ uid: string }>(cookies.token);

    const user = await this.userRepository.findById(userId);

    // todo: handle not found errors
    assert(user, 'expected user to exist');

    const command: ValidateUserEmailCommand = {
      userId: user.id,
      emailValidationToken: req.params.token,
    };

    try {
      await this.validateUserEmailHandler.handle(command);

      res.status(200);
      res.end();
    } catch (error) {
      if (error instanceof InvalidEmailValidationTokenError) {
        error.status = 400;
      }

      throw error;
    }
  };
}

injected(UserController, USER_TOKENS.userRepository, USER_TOKENS.validateUserEmailHandler);
