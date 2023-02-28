import { CommandBus, TOKENS } from '@shakala/common';
import {
  InvalidEmailValidationTokenError,
  UserRepository,
  USER_TOKENS,
  validateUserEmail,
} from '@shakala/user';
import { injected } from 'brandi';
import { RequestHandler, Router } from 'express';

import { isAuthenticated } from '../infrastructure/guards';

export class UserController {
  public readonly router: Router = Router();

  constructor(private readonly userRepository: UserRepository, private readonly commandBus: CommandBus) {
    this.router.get('/', isAuthenticated, this.getUserProfile);
    this.router.get('/validate-email/:token', isAuthenticated, this.validateEmail);
  }

  getUserProfile: RequestHandler = async (req, res) => {
    const user = await this.userRepository.findByIdOrFail(req.userId);

    // todo: query
    res.json({
      id: user.id,
      email: user.email,
    });

    res.end();
  };

  validateEmail: RequestHandler<{ token: string }> = async (req, res) => {
    const user = await this.userRepository.findByIdOrFail(req.userId);

    try {
      await this.commandBus.execute(
        validateUserEmail({
          userId: user.id,
          emailValidationToken: req.params.token,
        })
      );

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

injected(UserController, USER_TOKENS.userRepository, TOKENS.commandBus);
