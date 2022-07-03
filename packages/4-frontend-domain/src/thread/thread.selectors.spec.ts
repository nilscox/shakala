import { addComments } from '../comment';
import { createComment, createThread, TestStore } from '../test';

import { addThread, setThreadComments } from './thread.actions';
import { selectCommentThreadId } from './thread.selectors';

describe('thread selectors', () => {
  const store = new TestStore();

  describe('selectCommentThreadId', () => {
    const reply = createComment();
    const comment = createComment({ replies: [reply.id] });
    const threadId = 'threadId';

    beforeEach(() => {
      store.dispatch(addComments([comment], [reply]));
      store.dispatch(addThread(createThread({ id: threadId })));
      store.dispatch(setThreadComments(threadId, [comment]));
    });

    it("returns a root comment's thread id", () => {
      expect(store.select(selectCommentThreadId, comment.id)).toEqual(threadId);
    });

    it("returns a reply's thread id", () => {
      expect(store.select(selectCommentThreadId, reply.id)).toEqual(threadId);
    });
  });
});
