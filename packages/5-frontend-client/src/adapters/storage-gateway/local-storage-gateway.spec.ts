import { MockedObject } from 'vitest';

import { LocalStorageGateway } from './local-storage-gateway';

describe('LocalStorageGateway', () => {
  const getItem = vi.fn();
  const setItem = vi.fn();

  const storage = {
    getItem: getItem as Storage['getItem'],
    setItem: setItem as Storage['setItem'],
  } as MockedObject<Storage>;

  const gateway = new LocalStorageGateway(storage);
  const storageKey = LocalStorageGateway.storageKey;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  const mockDraftRootComments = (drafts: Record<string, string>) => {
    getItem.mockReturnValue(
      JSON.stringify({
        rootComment: drafts,
        reply: {},
        edition: {},
      }),
    );
  };

  const expectDraftRootComments = (drafts: Record<string, string>) => {
    expect(setItem).toHaveBeenCalledWith(
      storageKey,
      JSON.stringify({
        rootComment: drafts,
        reply: {},
        edition: {},
      }),
    );
  };

  it('reads a draft root comment text', async () => {
    expect(await gateway.getDraftCommentText('rootComment', 'threadId')).toBeUndefined();

    mockDraftRootComments({ threadId: 'text' });

    expect(await gateway.getDraftCommentText('rootComment', 'threadId')).toEqual('text');
  });

  it('adds a draft root comment text', async () => {
    await gateway.setDraftCommentText('rootComment', 'threadId', 'text');
    vi.runAllTimers();

    expectDraftRootComments({
      threadId: 'text',
    });
  });

  it('updates a draft root comment text', async () => {
    mockDraftRootComments({ threadId: 'text' });

    await gateway.setDraftCommentText('rootComment', 'threadId', 'updated');
    vi.runAllTimers();

    expectDraftRootComments({
      threadId: 'updated',
    });
  });

  it('adds another draft root comment text', async () => {
    mockDraftRootComments({ threadId: 'text' });

    await gateway.setDraftCommentText('rootComment', 'otherThreadId', 'other text');
    vi.runAllTimers();

    expectDraftRootComments({
      threadId: 'text',
      otherThreadId: 'other text',
    });
  });

  it("debounces the call to the storage's setItem", async () => {
    await gateway.setDraftCommentText('rootComment', 'threadId', 'te');
    await gateway.setDraftCommentText('rootComment', 'threadId', 'text');

    vi.runAllTimers();

    expect(setItem).not.toHaveBeenCalledWith(
      storageKey,
      JSON.stringify({
        rootComment: { threadId: 'te' },
        reply: {},
        edition: {},
      }),
    );

    expectDraftRootComments({
      threadId: 'text',
    });
  });

  it('removes a draft root comment text when providing an empty string', async () => {
    mockDraftRootComments({ threadId1: 'text1', threadId2: 'text2' });

    await gateway.setDraftCommentText('rootComment', 'threadId1', '');

    expectDraftRootComments({
      threadId2: 'text2',
    });
  });

  it('adds draft replies and editions', async () => {
    await gateway.setDraftCommentText('reply', 'parentId', 'reply');
    vi.runAllTimers();

    expect(setItem).toHaveBeenCalledWith(
      storageKey,
      JSON.stringify({
        rootComment: {},
        reply: { parentId: 'reply' },
        edition: {},
      }),
    );

    await gateway.setDraftCommentText('edition', 'commentId', 'edition');
    vi.runAllTimers();

    expect(setItem).toHaveBeenCalledWith(
      storageKey,
      JSON.stringify({
        rootComment: {},
        reply: {},
        edition: { commentId: 'edition' },
      }),
    );
  });
});
