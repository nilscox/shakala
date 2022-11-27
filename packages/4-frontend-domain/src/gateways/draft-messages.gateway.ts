export enum DraftCommentKind {
  root = 'root',
  reply = 'reply',
  edition = 'edition',
}

export interface DraftMessagesGateway {
  getDraftCommentText(kind: DraftCommentKind, id: string): Promise<string | undefined>;
  setDraftCommentText(kind: DraftCommentKind, id: string, text: string): Promise<void>;
  removeDraftCommentText(kind: DraftCommentKind, id: string): Promise<void>;
}
