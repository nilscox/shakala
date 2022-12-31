import { AbstractDraftsGateway, DraftsGateway, ThreadDraftsComments } from '@shakala/frontend-domain';

const debounceTimeout = 1000;

export class LocalStorageDraftsGateway extends AbstractDraftsGateway implements DraftsGateway {
  public static readonly storageKey = 'draft-comments';

  private timeoutId?: number;
  private storage!: Storage;

  constructor(storage?: Storage) {
    super();

    if (storage) {
      this.storage = storage;
    } else if (typeof localStorage !== 'undefined') {
      this.storage = localStorage;
    }
  }

  async getAllDrafts(): Promise<Record<string, ThreadDraftsComments>> {
    const json = this.storage.getItem(LocalStorageDraftsGateway.storageKey);

    if (!json) {
      return {};
    }

    return JSON.parse(json);
  }

  private async saveAllDrafts(drafts: Record<string, ThreadDraftsComments>): Promise<void> {
    this.storage.setItem(LocalStorageDraftsGateway.storageKey, JSON.stringify(drafts));
  }

  protected async save(threadId: string, drafts: ThreadDraftsComments, noDebounce?: boolean): Promise<void> {
    const allDrafts = await this.getAllDrafts();

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    const doSave = () => {
      allDrafts[threadId] = drafts;
      this.saveAllDrafts(allDrafts);

      delete this.timeoutId;
    };

    if (noDebounce) {
      doSave();
    } else {
      this.timeoutId = window.setTimeout(doSave, debounceTimeout);
    }
  }

  protected async delete(threadId: string): Promise<void> {
    const allDrafts = await this.getAllDrafts();

    delete allDrafts[threadId];
    this.saveAllDrafts(allDrafts);
  }
}
