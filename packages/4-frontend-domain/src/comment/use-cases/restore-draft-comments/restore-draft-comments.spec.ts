import { DraftCommentKind } from '../../../interfaces/storage.gateway';
import { createComment, createThread, TestStore } from '../../../test';
import { selectCreateRootCommentFormText } from '../../../thread';
import { addThread } from '../../../thread/thread.actions';
import { selectIsReplying, selectReplyFormText } from '../create-reply/create-reply';
import { selectEditCommentFormText, selectIsEditingComment } from '../edit-comment/edit-comment';

import { restoreDraftComments } from './restore-draft-comments';

describe('restoreDraftComments', () => {
  const store = new TestStore();

  const reply = createComment();
  const comment = createComment({ replies: [reply] });
  const thread = createThread({ comments: [comment] });

  beforeEach(() => {
    store.dispatch(addThread(thread));
  });

  const execute = () => {
    return store.dispatch(restoreDraftComments(thread.id));
  };

  it('restores the draft root comment text', async () => {
    store.storageGateway.set(DraftCommentKind.root, thread.id, 'draft');

    await execute();

    expect(store.select(selectCreateRootCommentFormText, thread.id)).toBe('draft');
  });

  it('restores the draft replies texts', async () => {
    store.storageGateway.set(DraftCommentKind.reply, comment.id, 'draft');

    await execute();

    expect(store.select(selectIsReplying, comment.id)).toBe(true);
    expect(store.select(selectReplyFormText, comment.id)).toBe('draft');
  });

  it('restores the draft editions texts', async () => {
    store.storageGateway.set(DraftCommentKind.edition, comment.id, 'draft');

    await execute();

    expect(store.select(selectIsEditingComment, comment.id)).toBe(true);
    expect(store.select(selectEditCommentFormText, comment.id)).toBe('draft');
  });

  it('restores the draft editions texts on replies', async () => {
    store.storageGateway.set(DraftCommentKind.edition, reply.id, 'draft');

    await execute();

    expect(store.select(selectIsEditingComment, reply.id)).toBe(true);
    expect(store.select(selectEditCommentFormText, reply.id)).toBe('draft');
  });
});
