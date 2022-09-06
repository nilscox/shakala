export type DraftCommentKind = 'rootComment' | 'reply' | 'edition';

export interface StorageGateway {
  getDraftCommentText(kind: DraftCommentKind, id: string): Promise<string | undefined>;
  setDraftCommentText(kind: DraftCommentKind, id: string, text: string): Promise<void>;
  removeDraftCommentText(kind: DraftCommentKind, id: string): Promise<void>;
}
