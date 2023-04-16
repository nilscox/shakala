import assert from 'assert';

import { CommandBus, QueryBus, TOKENS } from '@shakala/common';
import { updateUserProfileBodySchema, UserActivityDto, UserDto } from '@shakala/shared';
import {
  getUser,
  InvalidEmailValidationTokenError,
  listUserActivities,
  updateUserProfile,
  validateUserEmail,
} from '@shakala/user';
import { injected } from 'brandi';
import { RequestHandler, Router } from 'express';

import { isAuthenticated } from '../infrastructure/guards';
import { validateRequest } from '../infrastructure/validation';

export class AccountController {
  public readonly router: Router = Router();

  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {
    this.router.get('/', isAuthenticated, this.getProfile);
    this.router.get('/activities', isAuthenticated, this.listActivities);
    this.router.get('/validate-email/:token', isAuthenticated, this.validateEmail);
    this.router.put('/profile', isAuthenticated, this.updateProfile);
  }

  getProfile: RequestHandler<unknown, UserDto> = async (req, res) => {
    assert(req.userId);

    const result = await this.queryBus.execute(getUser({ id: req.userId }));

    res.status(200);
    res.json(result);
  };

  listActivities: RequestHandler<unknown, UserActivityDto[]> = async (req, res) => {
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

  // todo: POST
  validateEmail: RequestHandler<{ token: string }> = async (req, res) => {
    assert(req.userId);

    try {
      await this.commandBus.execute(
        validateUserEmail({
          userId: req.userId,
          emailValidationToken: req.params.token,
        })
      );

      // todo: 204
      res.status(200);
      res.end();
    } catch (error) {
      if (error instanceof InvalidEmailValidationTokenError) {
        error.status = 400;
      }

      throw error;
    }
  };

  updateProfile: RequestHandler = async (req, res) => {
    assert(req.userId);

    const body = await validateRequest(req).body(updateUserProfileBodySchema);

    await this.commandBus.execute(
      updateUserProfile({
        userId: req.userId,
        ...body,
      })
    );

    res.status(204);
    res.end();
  };
}

injected(AccountController, TOKENS.queryBus, TOKENS.commandBus);
