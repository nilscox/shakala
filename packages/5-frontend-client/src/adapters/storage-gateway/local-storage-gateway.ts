import { DraftCommentKind, StorageGateway } from 'frontend-domain';

type StoredDraftModel = Record<DraftCommentKind, Record<string, string>>;

export class LocalStorageGateway implements StorageGateway {
  public static readonly storageKey = 'draft-comments';

  private timeoutId?: number;

  constructor(private storage = window.localStorage) {}

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

      const drafts: StoredDraftModel = json
        ? (JSON.parse(json) as StoredDraftModel)
        : { rootComment: {}, reply: {}, edition: {} };

      updater(drafts[kind]);

      this.storage.setItem(LocalStorageGateway.storageKey, JSON.stringify(drafts));
    };

    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }

    if (debounce) {
      this.timeoutId = window.setTimeout(doSetItem, 1000);
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
