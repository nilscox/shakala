import assert from 'assert';

import { CommandBus, QueryBus, TOKENS } from '@shakala/common';
import {
  getUser,
  InvalidEmailValidationTokenError,
  validateUserEmail,
  listUserActivities,
} from '@shakala/user';
import { injected } from 'brandi';
import { RequestHandler, Router } from 'express';

import { isAuthenticated } from '../infrastructure/guards';
import { validateRequest } from '../infrastructure/validation';

export class UserController {
  public readonly router: Router = Router();

  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {
    this.router.get('/', isAuthenticated, this.getUserProfile);
    this.router.get('/activities', isAuthenticated, this.listUserActivities);
    this.router.get('/validate-email/:token', isAuthenticated, this.validateEmail);
  }

  getUserProfile: RequestHandler = async (req, res) => {
    assert(req.userId);

    const result = await this.queryBus.execute(getUser({ id: req.userId }));

    res.status(200);
    res.json(result);
  };

  listUserActivities: RequestHandler = async (req, res) => {
    assert(req.userId);

    const pagination = await validateRequest(req).pagination();

    const { total, items } = await this.queryBus.execute(
      listUserActivities({
        userId: req.userId,
        ...pagination,
      })
    );

    res.status(200);
    res.set('pagination-total', String(total));
    res.json(items);
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
