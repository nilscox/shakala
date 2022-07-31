import { addComments } from '../comment';
import { createComment, createThread, TestStore } from '../test';

import { addThread, setThreadComments } from './thread.actions';
import { selectCommentThreadId, selectFormattedThreadDate } from './thread.selectors';

describe('thread selectors', () => {
  const store = new TestStore();

  describe('selectCommentThreadId', () => {
    const reply = createComment();
    const comment = createComment({ replies: [reply] });
    const threadId = 'threadId';

    beforeEach(() => {
      store.dispatch(addComments([comment, reply]));
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

  describe('selectFormattedThreadDate', () => {
    const thread = createThread({
      date: new Date('2012-09-02T08:30:00').toISOString(),
    });

    beforeEach(() => {
      store.dispatch(addThread(thread));
    });

    it('returns the formatted thread creation date', () => {
      expect(store.select(selectFormattedThreadDate, thread.id)).toEqual('Le 2 septembre 2012');
    });
  });
});
