import { isEmptyObject } from 'shared';

import { DraftCommentKind, ThreadDraftsComments } from '../gateways/drafts.gateway';

export abstract class AbstractDraftsGateway {
  abstract getAllDrafts(): Promise<Record<string, ThreadDraftsComments>>;

  protected abstract save(
    threadId: string,
    drafts: ThreadDraftsComments,
    noDebounce?: boolean,
  ): Promise<void>;
  protected abstract delete(threadId: string): Promise<void>;

  async getDrafts(threadId: string): Promise<ThreadDraftsComments | undefined> {
    return (await this.getAllDrafts())[threadId];
  }

  async getDraft(kind: DraftCommentKind, threadId: string, commentId?: string): Promise<string | undefined> {
    const drafts = await this.getDrafts(threadId);

    if (!drafts) {
      return;
    }

    if (kind === 'root') {
      return drafts.root;
    } else if (kind === 'reply') {
      return drafts.replies[commentId as string];
    } else if (kind === 'edition') {
      return drafts.editions[commentId as string];
    }
  }

  async setDraft(kind: 'root' | 'reply' | 'edition', threadId: string, ...args: string[]): Promise<void> {
    const [commentId, text] = kind === 'root' ? [undefined, args[0]] : args;

    if (text === '') {
      return this.clearDraft(kind, threadId, commentId);
    }

    const drafts = (await this.getDrafts(threadId)) ?? { replies: {}, editions: {} };

    if (kind === 'root') {
      drafts.root = text;
    } else if (kind === 'reply') {
      drafts.replies[commentId as string] = text;
    } else if (kind === 'edition') {
      drafts.editions[commentId as string] = text;
    }

    await this.save(threadId, drafts);
  }

  async clearDraft(kind: 'root' | 'reply' | 'edition', threadId: string, commentId?: string): Promise<void> {
    const drafts = (await this.getDrafts(threadId)) ?? { replies: {}, editions: {} };

    if (kind === 'root') {
      delete drafts.root;
    } else if (kind === 'reply') {
      delete drafts.replies[commentId as string];
    } else if (kind === 'edition') {
      delete drafts.editions[commentId as string];
    }

    if (!drafts.root && isEmptyObject(drafts.replies) && isEmptyObject(drafts.editions)) {
      await this.delete(threadId);
    } else {
      await this.save(threadId, drafts, true);
    }
  }
}
