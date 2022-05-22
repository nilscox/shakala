import { FormData } from '@remix-run/node';
import { MockedObject } from 'vitest';

import { createComment, createThread } from '~/factories';
import { StubSessionService } from '~/server/common/session.service';
import { ValidationService } from '~/server/common/validation.service';
import { InMemoryUserRepository } from '~/server/data/user/in-memory-user.repository';
import { createRequest } from '~/server/test/create-request';
import { createUserEntity } from '~/server/test/factories';

import { InMemoryThreadRepository } from '../repositories/thread.repository.server';

import { ThreadController } from './thread.controller.server';
import { ThreadService } from './thread.service';

describe('ThreadController', () => {
  const sessionService = new StubSessionService();

  const userRepository = new InMemoryUserRepository();
  const threadRepository = new InMemoryThreadRepository([]);

  const threadService = {
    createComment: vi.fn(),
    updateComment: vi.fn(),
  } as MockedObject<ThreadService>;

  const controller = new ThreadController(
    sessionService,
    new ValidationService(),
    userRepository,
    threadRepository,
    threadService,
  );

  it('retrieves an existing thread', async () => {
    const threadId = 'threadId';
    const thread = createThread({ id: threadId });

    await threadRepository.addThread(thread);

    const request = createRequest();

    const response = await controller.getThread(request, threadId);

    expect(response).toHaveStatus(200);
    expect(await response.json()).toEqual(thread);
  });

  it('creates a new root comment on a thread', async () => {
    const form = new FormData();

    form.set('threadId', 'threadId');
    form.set('message', 'Hello!');

    const request = createRequest({ form });

    userRepository.save(createUserEntity({ id: 'userId' }));
    sessionService.save(sessionService.createSession('userId'));

    const comment = createComment();

    threadService.createComment.mockResolvedValueOnce(comment);

    const response = await controller.createComment(request);

    expect(response).toHaveStatus(201);
    expect(response.body).toBeNull();
  });

  it('updates an existing comment', async () => {
    const form = new FormData();

    form.set('commentId', 'commentId');
    form.set('message', 'Hello!');

    const request = createRequest({ form });

    userRepository.save(createUserEntity({ id: 'userId' }));
    sessionService.save(sessionService.createSession('userId'));

    const comment = createComment();

    threadService.createComment.mockResolvedValueOnce(comment);

    const response = await controller.updateComment(request);

    expect(response).toHaveStatus(204);
    expect(response.body).toBeNull();
  });
});
