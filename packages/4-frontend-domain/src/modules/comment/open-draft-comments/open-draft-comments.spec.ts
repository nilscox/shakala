import { StubDraftsGateway } from '../../../stubs/stub-drafts-gateway';
import { createTestStore, TestStore } from '../../../test-store';
import { createThread, threadActions } from '../../thread';
import { commentSelectors } from '../comment.selectors';
import { createComment } from '../comment.types';

import { openDraftComments } from './open-draft-comments';

describe('openDraftComments', () => {
  let store: TestStore;
  let draftMessagesGateway: StubDraftsGateway;

  beforeEach(() => {
    store = createTestStore();
    draftMessagesGateway = store.draftsGateway;

    const thread = createThread({
      id: 'threadId',
      comments: [
        createComment({
          id: 'commentId',
          replies: [createComment({ id: 'replyId' })],
        }),
      ],
    });

    store.dispatch(threadActions.setThread(thread));
  });

  it('opens the reply form on comments having a draft reply', async () => {
    await draftMessagesGateway.setDraft('reply', 'threadId', 'commentId', 'draft');

    await store.dispatch(openDraftComments('threadId'));

    expect(store.select(commentSelectors.isReplying, 'commentId')).toBe(true);
  });

  it('opens the edition form on comments having a draft edition', async () => {
    await draftMessagesGateway.setDraft('edition', 'threadId', 'commentId', 'draft');

    await store.dispatch(openDraftComments('threadId'));

    expect(store.select(commentSelectors.isEditing, 'commentId')).toBe(true);
  });

  it('opens the edition form on replies having a draft edition', async () => {
    await draftMessagesGateway.setDraft('edition', 'threadId', 'replyId', 'draft');

    await store.dispatch(openDraftComments('threadId'));

    expect(store.select(commentSelectors.isEditing, 'replyId')).toBe(true);
  });
});
