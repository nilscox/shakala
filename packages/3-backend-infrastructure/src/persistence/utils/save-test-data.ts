import { EntityManager } from '@mikro-orm/postgresql';
import { Repository } from 'backend-application';
import { Comment, createDomainDependencies, Reaction, Thread, User } from 'backend-domain';

import { MathRandomGeneratorService, RealDateService } from '../../infrastructure';
import { SqlCommentRepository } from '../repositories/sql-comment.repository';
import { SqlReactionRepository } from '../repositories/sql-reaction.repository';
import { SqlThreadRepository } from '../repositories/sql-thread.repository';
import { SqlUserRepository } from '../repositories/sql-user.repository';

export type SaveEntity = <T>(entity: T) => Promise<T>;

export const createDatabaseSaver = (getEntityManager: () => EntityManager) => {
  return async <T>(entity: T) => {
    const em = getEntityManager();

    const deps = createDomainDependencies({
      generatorService: new MathRandomGeneratorService(),
      dateService: new RealDateService(),
    });

    const commentRepository = new SqlCommentRepository(em, deps);
    const reactionRepository = new SqlReactionRepository(em, deps);
    const threadRepository = new SqlThreadRepository(em, deps);
    const userRepository = new SqlUserRepository(em, deps);

    const repositoryMap = new Map<unknown, Repository<unknown>>([
      [Comment, commentRepository],
      [Reaction, reactionRepository],
      [Thread, threadRepository],
      [User, userRepository],
    ]);

    // eslint-disable-next-line @typescript-eslint/ban-types
    const ctor = (entity as { constructor: Function }).constructor;
    const repository = repositoryMap.get(ctor);

    if (!repository) {
      throw new Error(`No repository for entity ${ctor.name}`);
    }

    await repository.save(entity);

    return entity;
  };
};
