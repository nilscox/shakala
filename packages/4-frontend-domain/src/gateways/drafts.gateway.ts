export type DraftCommentKind = 'root' | 'reply' | 'edition';

export type ThreadDraftsComments = {
  root?: string;
  replies: Record<string, string>;
  editions: Record<string, string>;
};

export interface DraftsGateway {
  getAllDrafts(): Promise<Record<string, ThreadDraftsComments>>;

  getDrafts(threadId: string): Promise<ThreadDraftsComments | undefined>;

  getDraft(kind: 'root', threadId: string): Promise<string | undefined>;
  getDraft(kind: 'edition' | 'reply', threadId: string, commentId: string): Promise<string | undefined>;

  setDraft(kind: 'root', threadId: string, text: string): Promise<void>;
  setDraft(kind: 'edition' | 'reply', threadId: string, commentId: string, text: string): Promise<void>;

  clearDraft(kind: 'root', threadId: string): Promise<void>;
  clearDraft(kind: 'edition' | 'reply', threadId: string, commentId: string): Promise<void>;
}
