import { CommandBus, QueryBus, TOKENS } from '@shakala/common';
import { listUserNotifications } from '@shakala/notification';
import { injected } from 'brandi';
import { RequestHandler, Router } from 'express';

import { isAuthenticated } from '../infrastructure/guards';

export class NotificationController {
  public readonly router: Router = Router();

  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {
    this.router.get('/', isAuthenticated, this.listNotifications);
  }

  listNotifications: RequestHandler = async (req, res) => {
    const notifications = await this.queryBus.execute(listUserNotifications({ userId: req.userId }));

    res.status(200);
    res.json(notifications);
  };
}

injected(NotificationController, TOKENS.queryBus, TOKENS.commandBus);
