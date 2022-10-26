import { EntityManager } from '@mikro-orm/postgresql';
import { Repository } from 'backend-application';
import {
  Comment,
  createDomainDependencies,
  Notification,
  Reaction,
  Thread,
  User,
  UserActivity,
} from 'backend-domain';
import { first } from 'shared';

import { MathRandomGeneratorAdapter, RealDateAdapter } from '../../infrastructure';
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

    const repositoryMap = new Map<unknown, Repository<unknown>>([
      [Comment, new SqlCommentRepository(em, deps)],
      [Notification, new SqlNotificationRepository(em, deps)],
      [Reaction, new SqlReactionRepository(em, deps)],
      [Thread, new SqlThreadRepository(em, deps)],
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
