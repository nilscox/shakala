import { DraftCommentKind, DraftMessagesGateway } from 'frontend-domain';

type StoredDraftModel = Record<DraftCommentKind, Record<string, string>>;

const DEBOUNCE_TIMEOUT = 1000;

export class LocalStorageGateway implements DraftMessagesGateway {
  public static readonly storageKey = 'draft-comments';

  private timeoutId?: number;
  private storage!: Storage;

  constructor(storage?: Storage) {
    if (storage) {
      this.storage = storage;
    } else if (typeof localStorage !== 'undefined') {
      this.storage = localStorage;
    }
  }

  private getDrafts(kind: DraftCommentKind): Record<string, string> {
    const json = this.storage.getItem(LocalStorageGateway.storageKey);

    if (!json) {
      return {};
    }

    return JSON.parse(json)[kind];
  }

  private updateDrafts(
    kind: DraftCommentKind,
    debounce: boolean,
    updater: (drafts: Record<string, string>) => void,
  ): void {
    const doSetItem = () => {
      const json = this.storage.getItem(LocalStorageGateway.storageKey);

      let drafts: StoredDraftModel = {
        [DraftCommentKind.root]: {},
        [DraftCommentKind.reply]: {},
        [DraftCommentKind.edition]: {},
      };

      if (json) {
        drafts = JSON.parse(json) as StoredDraftModel;
      }

      updater(drafts[kind]);

      this.storage.setItem(LocalStorageGateway.storageKey, JSON.stringify(drafts));
    };

    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }

    if (debounce) {
      this.timeoutId = window.setTimeout(doSetItem, DEBOUNCE_TIMEOUT);
    } else {
      doSetItem();
    }
  }

  async getDraftCommentText(kind: DraftCommentKind, id: string): Promise<string | undefined> {
    return this.getDrafts(kind)[id];
  }

  async setDraftCommentText(kind: DraftCommentKind, id: string, text: string): Promise<void> {
    if (text === '') {
      this.removeDraftCommentText(kind, id);
      return;
    }

    this.updateDrafts(kind, true, (drafts) => {
      drafts[id] = text;
    });
  }

  async removeDraftCommentText(kind: DraftCommentKind, id: string): Promise<void> {
    this.updateDrafts(kind, false, (drafts) => {
      delete drafts[id];
    });
  }
}
