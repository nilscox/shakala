import { createCommentDto, createThreadDto } from 'shared';

import { createCommentForm, TestStore } from '../../../test';
import { selectThread } from '../../thread.selectors';

import { setThread } from './set-thread';

describe('setThread', () => {
  const store = new TestStore();

  it('stores a thread', () => {
    const thread = createThreadDto();

    store.dispatch(setThread(thread, []));

    expect(store.select(selectThread, thread.id)).toEqual({
      ...thread,
      comments: [],
      createCommentForm: createCommentForm({ open: true }),
    });
  });

  it("stores the thread's comments", () => {
    const reply = createCommentDto();
    const comment = createCommentDto({ replies: [reply] });
    const thread = createThreadDto();

    store.dispatch(setThread(thread, [comment]));

    expect(store.select(selectThread, thread.id)).toHaveProperty('comments', [
      {
        ...comment,
        replies: [
          {
            ...reply,
            replies: [],
            replyForm: createCommentForm(),
            editionForm: createCommentForm(),
          },
        ],
        replyForm: createCommentForm(),
        editionForm: createCommentForm(),
      },
    ]);
  });
});
