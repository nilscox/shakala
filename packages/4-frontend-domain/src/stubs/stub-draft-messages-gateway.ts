import { DraftCommentKind, DraftMessagesGateway } from '../gateways/draft-messages.gateway';

export class StubDraftMessagesGateway implements DraftMessagesGateway {
  private drafts = new Map<string, string>();

  async getDraftCommentText(kind: DraftCommentKind, id: string): Promise<string | undefined> {
    return this.get(kind, id);
  }

  async setDraftCommentText(kind: DraftCommentKind, id: string, text: string): Promise<void> {
    this.drafts.set(this.getKey(kind, id), text);
  }

  async removeDraftCommentText(kind: DraftCommentKind, id: string): Promise<void> {
    this.drafts.delete(this.getKey(kind, id));
  }

  has(kind: DraftCommentKind, id: string) {
    return this.drafts.has(this.getKey(kind, id));
  }

  get(kind: DraftCommentKind, id: string) {
    return this.drafts.get(this.getKey(kind, id));
  }

  set(kind: DraftCommentKind, id: string, text: string) {
    this.drafts.set(this.getKey(kind, id), text);
  }

  private getKey(kind: DraftCommentKind, id: string) {
    return [kind, id].join(':');
  }
}
