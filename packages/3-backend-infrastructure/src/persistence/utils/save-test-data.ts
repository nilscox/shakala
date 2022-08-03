import { EntityManager } from '@mikro-orm/postgresql';
import { Repository } from 'backend-application';
import { Comment, Reaction, Thread, User } from 'backend-domain';

import { SqlCommentRepository } from '../repositories/sql-comment.repository';
import { SqlReactionRepository } from '../repositories/sql-reaction.repository';
import { SqlThreadRepository } from '../repositories/sql-thread.repository';
import { SqlUserRepository } from '../repositories/sql-user.repository';

export type SaveEntity = <T>(entity: T) => Promise<T>;

export const sqlHelpers = (em: EntityManager) => {
  const commentRepository = new SqlCommentRepository(em);
  const reactionRepository = new SqlReactionRepository(em);
  const threadRepository = new SqlThreadRepository(em);
  const userRepository = new SqlUserRepository(em);

  const repositoryMap = new Map<unknown, Repository<unknown>>([
    [Comment, commentRepository],
    [Reaction, reactionRepository],
    [Thread, threadRepository],
    [User, userRepository],
  ]);

  return {
    commentRepository,
    reactionRepository,
    threadRepository,
    userRepository,

    async save<T extends { new (): T }>(entity: T) {
      const ctor = entity.constructor;
      const repository = repositoryMap.get(ctor);

      if (!repository) {
        throw new Error(`No repository for entity ${ctor.name}`);
      }

      await repository.save(entity);

      return entity;
    },
  };
};
