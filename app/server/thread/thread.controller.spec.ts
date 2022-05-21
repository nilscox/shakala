import { FormData } from '@remix-run/node';
import { MockedObject } from 'vitest';

import { InMemoryUserRepository } from '~/data/user.repository';
import { createComment, createUser } from '~/factories';

import { StubSessionService } from '../common/session.service';
import { ValidationService } from '../common/validation.service';
import { createRequest } from '../test/create-request';

import { ThreadController } from './thread.controller.server';
import { ThreadService } from './thread.service';

describe('ThreadController', () => {
  const sessionService = new StubSessionService();

  const userRepository = new InMemoryUserRepository([]);

  const threadService = {
    createComment: vi.fn(),
  } as MockedObject<ThreadService>;

  const controller = new ThreadController(
    sessionService,
    new ValidationService(),
    userRepository,
    threadService,
  );

  it('creates a new comment on an existing thread', async () => {
    const form = new FormData();

    form.set('threadId', 'threadId');
    form.set('message', 'Hello!');

    const request = createRequest({ form });

    userRepository.save(createUser({ id: 'userId' }));
    sessionService.save(sessionService.createSession('userId'));

    const comment = createComment();

    threadService.createComment.mockResolvedValueOnce(comment);

    const response = await controller.createComment(request);

    expect(response).toHaveStatus(201);
    expect(await response.json()).toEqual(comment);
  });
});
