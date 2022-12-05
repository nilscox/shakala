import {
  CreateThreadCommand,
  ExecutionContext,
  GetLastThreadsQuery,
  GetThreadQuery,
  GetThreadQueryResult,
  Sort,
} from 'backend-application';
import { factories } from 'backend-domain';
import { mockResolve } from 'shared/test';

import { StubConfigAdapter, ValidationError, ValidationService } from '../../infrastructure';
import { MockLoggerAdapter } from '../../infrastructure/test';
import { MockCommandBus, MockQueryBus, MockRequest, StubSessionAdapter } from '../../test';
import { UserPresenter } from '../user/user.presenter';

import { ThreadController } from './thread.controller';
import { ThreadPresenter } from './thread.presenter';

describe('ThreadController', () => {
  const queryBus = new MockQueryBus();
  const commandBus = new MockCommandBus();
  const session = new StubSessionAdapter();
  const validationService = new ValidationService();
  const threadPresenter = new ThreadPresenter(new UserPresenter(new StubConfigAdapter()));

  const controller = new ThreadController(
    new MockLoggerAdapter(),
    queryBus,
    commandBus,
    session,
    validationService,
    threadPresenter,
  );

  const create = factories();

  describe('getLastThreads', () => {
    const thread = create.thread();

    beforeEach(() => {
      queryBus.for(GetLastThreadsQuery).return([thread]);
    });

    it('retrieves the last threads', async () => {
      const response = await controller.getLastThreads(new MockRequest());

      expect(response).toHaveStatus(200);
      expect(response.body).toHaveLength(1);
      expect(response.body).toHaveProperty('0.id', thread.id);

      expect(queryBus.lastQuery).toEqual(new GetLastThreadsQuery(10));
    });

    it('retrieves the 3 last threads', async () => {
      await controller.getLastThreads(new MockRequest().withQuery('count', '3'));

      expect(queryBus.lastQuery).toEqual(new GetLastThreadsQuery(3));
    });

    it('fails when the count is not valid', async () => {
      await expect
        .rejects(controller.getLastThreads(new MockRequest().withQuery('count', '-1')))
        .with(ValidationError);
    });
  });

  describe('getThread', () => {
    const threadId = 'threadId';
    const thread = create.thread({ id: threadId });

    beforeEach(() => {
      queryBus.for(GetThreadQuery).return<GetThreadQueryResult>({
        thread,
        comments: [],
        replies: new Map(),
        reactionsCounts: new Map(),
        userReactions: new Map(),
        userSubscriptions: new Map(),
      });
    });

    it('retrieves a thread', async () => {
      const response = await controller.getThread(new MockRequest().withParam('id', thread.id));

      expect(response).toHaveStatus(200);
      expect(response.body).toHaveProperty('id', threadId);

      expect(queryBus.lastQuery).toEqual(new GetThreadQuery(thread.id, Sort.relevance));
    });

    it('retrieves a thread as an authenticated user', async () => {
      const userId = 'userId';

      session.user = create.user({ id: userId });

      await controller.getThread(new MockRequest().withParam('id', thread.id));

      expect(queryBus.lastQuery).toEqual(new GetThreadQuery(thread.id, Sort.relevance, undefined, userId));
    });

    it('fails to retrieves an thread that does not exist', async () => {
      queryBus.for(GetThreadQuery).return(undefined);

      const response = await expect
        .rejects(controller.getThread(new MockRequest().withParam('id', thread.id)))
        .with(expect.anything());

      expect(response).toHaveProperty('body', {
        code: 'NotFound',
        message: 'thread not found',
        details: { threadId: thread.id },
      });
    });
  });

  describe('createThread', () => {
    const user = create.user();
    const description = 'description';
    const text = 'text';
    const keywords = ['key', 'words'];

    const ctx = new ExecutionContext(user);

    const threadId = 'threadId';

    beforeEach(() => {
      session.user = user;
      commandBus.execute = mockResolve(threadId);
    });

    it('creates a thread', async () => {
      const response = await controller.createThread(
        new MockRequest().withBody({ description, text, keywords }),
      );

      expect(response).toHaveStatus(201);
      expect(response).toHaveBody({ id: threadId });

      expect(commandBus.execute).toHaveBeenCalledWith(
        new CreateThreadCommand(description, text, keywords),
        ctx,
      );
    });

    it('fails to create a thread with an invalid body', async () => {
      const request = new MockRequest().withBody({ description: 'a', text, keywords: ['a'] });

      const error = await expect.rejects(controller.createThread(request)).with(ValidationError);

      expect(error).toHaveProperty('fields.0.field', 'description');
      expect(error).toHaveProperty('fields.0.error', 'min');
      expect(error).toHaveProperty('fields.1.field', 'keywords[0]');
      expect(error).toHaveProperty('fields.1.error', 'min');
    });
  });
});
