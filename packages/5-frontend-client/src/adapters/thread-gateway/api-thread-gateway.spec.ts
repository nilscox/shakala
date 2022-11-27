import { createComment, createThread } from 'frontend-domain';

import { StubHttpGateway, StubResponse } from '../http-gateway/stub-http.gateway';

import { ApiThreadGateway } from './api-thread-gateway';

describe('ApiThreadGateway', () => {
  const http = new StubHttpGateway();
  const gateway = new ApiThreadGateway(http);

  describe('fetchThread', () => {
    it('fetches a thread from its id', async () => {
      const comment = createComment();
      const thread = createThread({ comments: [comment] });

      http.for('get', `/thread/${thread.id}`).return(StubResponse.create({ body: thread }));

      expect(await gateway.fetchThread(thread.id)).toEqual(thread);
    });

    it('returns undefined when the thread does not exist', async () => {
      http.for('get', `/thread/threadId`).throw(StubResponse.notFound());

      expect(await gateway.fetchThread('threadId')).toBe(undefined);
    });
  });
});
