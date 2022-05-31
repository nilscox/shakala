import { StubDateService } from '../common/date.service';
import { StubGeneratorService } from '../common/generator.service';
import { InMemoryCommentRepository } from '../data/comment/in-memory-comment.repository';
import { createCommentEntity, createThreadEntity, createTimestamp, createUser } from '../test/factories';

import { CommentAuthor, UserMustBeAuthorError } from './comment.entity';
import { CommentService } from './comment.service';
import { Markdown } from './markdown.value-object';

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

  const now = createTimestamp();
  const author = createUser();
  const thread = createThreadEntity();
  const commentId = 'commentId';

  beforeEach(() => {
    dateService.setNow(new Date(now.value));
  });

  describe('createComment', () => {
    it('creates a new comment', async () => {
      generatorService.nextId = commentId;

      const result = await service.createComment(author, thread.id, null, 'Hello!');

      const createdComment = await commentRepository.findById(result.id);

      expect(createdComment).toBeDefined();
      expect(createdComment).toHaveProperty('id', commentId);
      expect(createdComment).toHaveProperty('threadId', thread.id);
      expect(createdComment).toHaveProperty('author.id', author.id);
      expect(createdComment).toHaveProperty('author.nick', author.nick);
      expect(createdComment).toHaveProperty('author.profileImage', author.profileImage);
      expect(createdComment).toHaveProperty('parentId', null);
      expect(createdComment).toHaveProperty('text.value', 'Hello!');
      expect(createdComment).toHaveProperty('upvotes', 0);
      expect(createdComment).toHaveProperty('downvotes', 0);
      expect(createdComment).toHaveProperty('creationDate', now);
      expect(createdComment).toHaveProperty('lastEditionDate', now);
    });
  });

  describe('updateComment', () => {
    const author = createUser();
    const comment = createCommentEntity({
      id: commentId,
      author: CommentAuthor.create(author),
      text: 'Hello!',
    });

    beforeEach(() => {
      commentRepository.set(comment);
    });

    it('updates an existing comment', async () => {
      await service.updateComment(author, commentId, 'Updated!');

      const updatedComment = await commentRepository.findById(commentId);

      expect(updatedComment).toHaveProperty('text', Markdown.create('Updated!'));
      expect(updatedComment).toHaveProperty('lastEditionDate', now);
    });

    it('prevents a user to update a comment when he is not the author', async () => {
      const notAuthor = createUser();

      await expect(service.updateComment(notAuthor, commentId, 'Updated!')).rejects.toThrow(
        UserMustBeAuthorError,
      );
    });
  });
});
