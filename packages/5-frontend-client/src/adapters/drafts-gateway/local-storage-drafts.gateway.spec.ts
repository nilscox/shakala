import { SinonFakeTimers, useFakeTimers } from 'sinon';

import { LocalStorageDraftsGateway } from './local-storage-drafts.gateway';

class StubStorage implements Storage {
  readonly items = new Map<string, string>();

  get itemsArray() {
    return Object.values(this.items);
  }

  get length(): number {
    return this.itemsArray.length;
  }

  clear(): void {
    this.items.clear();
  }

  getItem(key: string): string | null {
    return this.items.get(key) ?? null;
  }

  key(index: number): string | null {
    return this.itemsArray[index] ?? null;
  }

  removeItem(key: string): void {
    this.items.delete(key);
  }

  setItem(key: string, value: string): void {
    this.items.set(key, value);
  }
}

describe('LocalStorageDraftsGateway', () => {
  let timers: SinonFakeTimers;

  beforeEach(() => {
    timers = useFakeTimers();
  });

  afterEach(() => {
    timers.restore();
  });

  let storage: StubStorage;
  let gateway: LocalStorageDraftsGateway;

  beforeEach(() => {
    storage = new StubStorage();
    gateway = new LocalStorageDraftsGateway(storage);
  });

  const setDraft = (threadId: string, text: string) => {
    storage.setItem(
      LocalStorageDraftsGateway.storageKey,
      JSON.stringify({
        [threadId]: { root: text, replies: {}, editions: {} },
      }),
    );
  };

  const getDraft = (threadId: string) => {
    return JSON.parse(storage.getItem(LocalStorageDraftsGateway.storageKey) ?? '{}')[threadId];
  };

  it('reads a draft root comment text', async () => {
    expect(await gateway.getDraft('root', 'threadId')).toBe(undefined);

    setDraft('threadId', 'text');

    expect(await gateway.getDraft('root', 'threadId')).toEqual('text');
  });

  it('adds a draft root comment text', async () => {
    await gateway.setDraft('root', 'threadId', 'text');
    timers.runAll();

    expect(getDraft('threadId')).toHaveProperty('root', 'text');
  });

  it('updates a draft root comment text', async () => {
    setDraft('threadId', 'text');

    await gateway.setDraft('root', 'threadId', 'updated');
    timers.runAll();

    expect(getDraft('threadId')).toHaveProperty('root', 'updated');
  });

  it('adds another draft root comment text', async () => {
    setDraft('threadId', 'text');

    await gateway.setDraft('root', 'otherThreadId', 'other text');
    timers.runAll();

    expect(getDraft('threadId')).toHaveProperty('root', 'text');
    expect(getDraft('otherThreadId')).toHaveProperty('root', 'other text');
  });

  it('removes a draft root comment text when providing an empty string', async () => {
    setDraft('threadId1', 'text1');
    setDraft('threadId2', 'text2');

    await gateway.setDraft('root', 'threadId1', '');

    expect(getDraft('threadId1')).toBe(undefined);
    expect(getDraft('threadId2')).toHaveProperty('root', 'text2');
  });

  it('adds draft replies and editions', async () => {
    await gateway.setDraft('reply', 'threadId', 'parentId', 'reply');
    timers.runAll();

    await gateway.setDraft('edition', 'threadId', 'commentId', 'edition');
    timers.runAll();

    expect(storage.getItem(LocalStorageDraftsGateway.storageKey)).toEqual(
      JSON.stringify({
        threadId: {
          replies: { parentId: 'reply' },
          editions: { commentId: 'edition' },
        },
      }),
    );
  });
});
