import { expect, StubEventPublisher, StubGeneratorAdapter } from '@shakala/common';
import { beforeEach, describe, it } from 'vitest';

import { ReactionType } from '../../entities/reaction.entity';
import { create } from '../../factories';
import { InMemoryCommentRepository } from '../../repositories/comment/in-memory-comment.repository';
import { InMemoryReactionRepository } from '../../repositories/reaction/in-memory-reaction.repository';

import {
  CannotSetReactionOnOwnCommentError,
  CommentReactionChangedEvent,
  SetReactionHandler,
} from './set-reaction';

describe('SetReactionCommand', () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
  });

  describe('create reaction', () => {
    it('creates a new reaction on a comment', async () => {
      await test.act(ReactionType.upvote);

      const reaction = test.getReaction();

      expect(reaction).toBeDefined();
      expect(reaction).toHaveProperty('id', 'reactionId');
      expect(reaction).toHaveProperty('userId', 'userId');
      expect(reaction).toHaveProperty('commentId', 'commentId');
      expect(reaction).toHaveProperty('type', ReactionType.upvote);
    });

    it('publishes a CommentReactionSetEvent', async () => {
      await test.act(ReactionType.upvote);

      expect(test.publisher).toHavePublished(
        new CommentReactionChangedEvent('commentId', 'userId', null, ReactionType.upvote)
      );
    });
  });

  describe('update reaction', () => {
    it('updates an existing reaction on a comment', async () => {
      test.reactionRepository.add(test.createReaction(ReactionType.upvote));

      await test.act(ReactionType.downvote);

      expect(test.getReaction()).toHaveProperty('type', ReactionType.downvote);
    });

    it('publishes a CommentReactionSetEvent', async () => {
      test.reactionRepository.add(test.createReaction(ReactionType.upvote));

      await test.act(ReactionType.downvote);

      expect(test.publisher).toHavePublished(
        new CommentReactionChangedEvent('commentId', 'userId', ReactionType.upvote, ReactionType.downvote)
      );
    });
  });

  describe('delete reaction', () => {
    it('deletes a reaction from a comment', async () => {
      test.reactionRepository.add(test.createReaction());

      await test.act(null);

      expect(test.getReaction()).toBeUndefined();
    });
    it('publishes a CommentReactionSetEvent', async () => {
      test.reactionRepository.add(test.createReaction(ReactionType.upvote));

      await test.act(null);

      expect(test.publisher).toHavePublished(
        new CommentReactionChangedEvent('commentId', 'userId', ReactionType.upvote, null)
      );
    });
  });

  it('prevents a user to set a reaction on his own comment', async () => {
    await expect(test.act(ReactionType.upvote, 'authorId')).toRejectWith(CannotSetReactionOnOwnCommentError);
  });
});

class Test {
  comment = create.comment({ id: 'commentId', authorId: 'authorId' });

  generator = new StubGeneratorAdapter();
  publisher = new StubEventPublisher();
  commentRepository = new InMemoryCommentRepository([this.comment]);
  reactionRepository = new InMemoryReactionRepository();

  handler = new SetReactionHandler(
    this.generator,
    this.publisher,
    this.commentRepository,
    this.reactionRepository
  );

  constructor() {
    this.generator.nextId = 'reactionId';
  }

  getReaction() {
    return this.reactionRepository.get('reactionId');
  }

  createReaction(type = ReactionType.upvote) {
    return create.reaction({
      id: 'reactionId',
      userId: 'userId',
      commentId: 'commentId',
      type,
    });
  }

  async act(type: ReactionType | null, userId = 'userId') {
    await this.handler.handle({
      commentId: 'commentId',
      userId,
      reactionType: type,
    });
  }
}
