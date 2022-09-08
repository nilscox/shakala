import { DraftCommentKind } from 'frontend-domain';
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

  beforeAll(() => void vi.useFakeTimers());
  afterAll(() => void vi.useRealTimers());

  const createStorageItem = (kind: DraftCommentKind, value: Record<string, string>) => {
    return JSON.stringify({
      [DraftCommentKind.root]: {},
      [DraftCommentKind.reply]: {},
      [DraftCommentKind.edition]: {},
      [kind]: value,
    });
  };

  const mockDraftRootComments = (drafts: Record<string, string>) => {
    getItem.mockReturnValue(createStorageItem(DraftCommentKind.root, drafts));
  };

  const expectDraftRootComments = (drafts: Record<string, string>) => {
    expect(setItem).toHaveBeenCalledWith(storageKey, createStorageItem(DraftCommentKind.root, drafts));
  };

  it('reads a draft root comment text', async () => {
    expect(await gateway.getDraftCommentText(DraftCommentKind.root, 'threadId')).toBeUndefined();

    mockDraftRootComments({ threadId: 'text' });

    expect(await gateway.getDraftCommentText(DraftCommentKind.root, 'threadId')).toEqual('text');
  });

  it('adds a draft root comment text', async () => {
    await gateway.setDraftCommentText(DraftCommentKind.root, 'threadId', 'text');
    vi.runAllTimers();

    expectDraftRootComments({
      threadId: 'text',
    });
  });

  it('updates a draft root comment text', async () => {
    mockDraftRootComments({ threadId: 'text' });

    await gateway.setDraftCommentText(DraftCommentKind.root, 'threadId', 'updated');
    vi.runAllTimers();

    expectDraftRootComments({
      threadId: 'updated',
    });
  });

  it('adds another draft root comment text', async () => {
    mockDraftRootComments({ threadId: 'text' });

    await gateway.setDraftCommentText(DraftCommentKind.root, 'otherThreadId', 'other text');
    vi.runAllTimers();

    expectDraftRootComments({
      threadId: 'text',
      otherThreadId: 'other text',
    });
  });

  it("debounces the call to the storage's setItem", async () => {
    await gateway.setDraftCommentText(DraftCommentKind.root, 'threadId', 'te');
    await gateway.setDraftCommentText(DraftCommentKind.root, 'threadId', 'text');

    vi.runAllTimers();

    expect(setItem).not.toHaveBeenCalledWith(
      storageKey,
      createStorageItem(DraftCommentKind.root, { threadId: 'te' }),
    );

    expectDraftRootComments({
      threadId: 'text',
    });
  });

  it('removes a draft root comment text when providing an empty string', async () => {
    mockDraftRootComments({ threadId1: 'text1', threadId2: 'text2' });

    await gateway.setDraftCommentText(DraftCommentKind.root, 'threadId1', '');

    expectDraftRootComments({
      threadId2: 'text2',
    });
  });

  it('adds draft replies and editions', async () => {
    await gateway.setDraftCommentText(DraftCommentKind.reply, 'parentId', 'reply');
    vi.runAllTimers();

    expect(setItem).toHaveBeenCalledWith(
      storageKey,
      createStorageItem(DraftCommentKind.reply, { parentId: 'reply' }),
    );

    await gateway.setDraftCommentText(DraftCommentKind.edition, 'commentId', 'edition');
    vi.runAllTimers();

    expect(setItem).toHaveBeenCalledWith(
      storageKey,
      createStorageItem(DraftCommentKind.edition, { commentId: 'edition' }),
    );
  });
});
