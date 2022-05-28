import { StubDateService } from '../common/date.service';
import { StubGeneratorService } from '../common/generator.service';
import { InMemoryCommentRepository } from '../data/comment/in-memory-comment.repository';
import { createCommentEntity, createThreadEntity, createUserEntity } from '../test/factories';

import { CommentService, UserMustBeAuthorError } from './comment.service';

describe('CommentService', () => {
  const dateService = new StubDateService();
  const generatorService = new StubGeneratorService();
  const commentRepository = new InMemoryCommentRepository();

  const service = new CommentService(dateService, generatorService, commentRepository);

  beforeEach(() => {
    dateService.reset();
    generatorService.reset();
    commentRepository.clear();
  });

  const now = new Date('2022-01-01');
  const author = createUserEntity();
  const thread = createThreadEntity();
  const commentId = 'commentId';

  beforeEach(() => {
    dateService.setNow(now);
  });

  describe('createComment', () => {
    it('creates a new comment', async () => {
      generatorService.nextId = commentId;

      const result = await service.createComment(author, thread.id, null, 'Hello!');

      const createdComment = await commentRepository.findById(result.id);

      expect(createdComment).toBeDefined();
      expect(createdComment).toHaveProperty('id', commentId);
      expect(createdComment).toHaveProperty('threadId', thread.id);
      expect(createdComment).toHaveProperty('authorId', author.id);
      expect(createdComment).toHaveProperty('parentId', null);
      expect(createdComment).toHaveProperty('text', 'Hello!');
      expect(createdComment).toHaveProperty('upvotes', 0);
      expect(createdComment).toHaveProperty('downvotes', 0);
      expect(createdComment).toHaveProperty('createdAt', now.toISOString());
      expect(createdComment).toHaveProperty('updatedAt', now.toISOString());
    });
  });

  describe('updateComment', () => {
    const author = createUserEntity();
    const comment = createCommentEntity({ id: commentId, authorId: author.id, text: 'Hello!' });

    beforeEach(() => {
      commentRepository.set(comment);
    });

    it('updates an existing comment', async () => {
      await service.updateComment(author, commentId, 'Updated!');

      const updatedComment = await commentRepository.findById(commentId);

      expect(updatedComment).toHaveProperty('text', 'Updated!');
      expect(updatedComment).toHaveProperty('updatedAt', now.toISOString());
    });

    it('prevents a user to update a comment when he is not the author', async () => {
      const notAuthor = createUserEntity();

      await expect(service.updateComment(notAuthor, commentId, 'Updated!')).rejects.toThrow(
        UserMustBeAuthorError,
      );
    });
  });
});
