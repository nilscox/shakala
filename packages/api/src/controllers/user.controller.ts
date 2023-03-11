import assert from 'assert';

import { CommandBus, QueryBus, TOKENS } from '@shakala/common';
import { getUser, InvalidEmailValidationTokenError, validateUserEmail } from '@shakala/user';
import { injected } from 'brandi';
import { RequestHandler, Router } from 'express';

import { isAuthenticated } from '../infrastructure/guards';

export class UserController {
  public readonly router: Router = Router();

  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {
    this.router.get('/', isAuthenticated, this.getUserProfile);
    this.router.get('/validate-email/:token', isAuthenticated, this.validateEmail);
  }

  getUserProfile: RequestHandler = async (req, res) => {
    assert(req.userId);

    const result = await this.queryBus.execute(getUser({ id: req.userId }));

    res.status(200);
    res.json(result);
  };

  validateEmail: RequestHandler<{ token: string }> = async (req, res) => {
    assert(req.userId);

    try {
      await this.commandBus.execute(
        validateUserEmail({
          userId: req.userId,
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

injected(UserController, TOKENS.queryBus, TOKENS.commandBus);
