import { EntityManager } from '@mikro-orm/postgresql';
import { Repository } from '@shakala/backend-application';
import {
  Comment,
  CommentSubscription,
  createDomainDependencies,
  Notification,
  Reaction,
  Thread,
  User,
  UserActivity,
} from '@shakala/backend-domain';
import { first } from '@shakala/shared';

import { MathRandomGeneratorAdapter, RealDateAdapter } from '../../infrastructure';
import { SqlCommentSubscriptionRepository } from '../repositories/sql-comment-subscription.repository';
import { SqlCommentRepository } from '../repositories/sql-comment.repository';
import { SqlNotificationRepository } from '../repositories/sql-notification.repository';
import { SqlReactionRepository } from '../repositories/sql-reaction.repository';
import { SqlThreadRepository } from '../repositories/sql-thread.repository';
import { SqlUserActivityRepository } from '../repositories/sql-user-activity.repository';
import { SqlUserRepository } from '../repositories/sql-user.repository';

export const createDatabaseSaver = (getEntityManager: () => EntityManager) => {
  async function save<T>(entity: T): Promise<T>;
  async function save<T>(entity: T[]): Promise<T[]>;

  async function save<T>(entities: T | T[]): Promise<T | T[]> {
    if (!Array.isArray(entities)) {
      return first(await save([entities])) as T;
    }

    const em = getEntityManager();

    const deps = createDomainDependencies({
      generator: new MathRandomGeneratorAdapter(),
      date: new RealDateAdapter(),
    });

    const commentRepository = new SqlCommentRepository(em, deps);

    const repositoryMap = new Map<unknown, Repository<unknown>>([
      [Comment, commentRepository],
      [CommentSubscription, new SqlCommentSubscriptionRepository(em, deps)],
      [Notification, new SqlNotificationRepository(em, deps)],
      [Reaction, new SqlReactionRepository(em, deps)],
      [Thread, new SqlThreadRepository(em, deps, commentRepository)],
      [User, new SqlUserRepository(em, deps)],
      [UserActivity, new SqlUserActivityRepository(em, deps)],
    ]);

    // eslint-disable-next-line @typescript-eslint/ban-types
    const ctor = (entities[0] as { constructor: Function }).constructor;
    const repository = repositoryMap.get(ctor);

    if (!repository) {
      throw new Error(`No repository for entity ${ctor.name}`);
    }

    for (const entity of entities) {
      await repository.save(entity);
    }

    return entities;
  }

  return save;
};
