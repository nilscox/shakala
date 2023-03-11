import assert from 'assert';

import { CommandBus, QueryBus, TOKENS } from '@shakala/common';
import { listUserNotifications, markNotificationAsSeen } from '@shakala/notification';
import { injected } from 'brandi';
import { RequestHandler, Router } from 'express';

import { hasWriteAccess, isAuthenticated } from '../infrastructure/guards';
import { validateRequest } from '../infrastructure/validation';

export class NotificationController {
  public readonly router: Router = Router();

  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {
    this.router.get('/', isAuthenticated, this.listNotifications);
    this.router.put('/:notificationId/seen', [isAuthenticated, hasWriteAccess], this.markNotificationAsSeen);
  }

  listNotifications: RequestHandler = async (req, res) => {
    assert(req.userId);

    const pagination = await validateRequest(req).pagination();

    const { total, items: notifications } = await this.queryBus.execute(
      listUserNotifications({ userId: req.userId, ...pagination })
    );

    res.set('pagination-total', String(total));
    res.status(200);
    res.json(notifications);
  };

  // todo: assert user has notification
  markNotificationAsSeen: RequestHandler<{ notificationId: string }> = async (req, res) => {
    const { notificationId } = req.params;

    await this.commandBus.execute(markNotificationAsSeen({ notificationId }));

    res.status(204);
    res.end();
  };
}

injected(NotificationController, TOKENS.queryBus, TOKENS.commandBus);
