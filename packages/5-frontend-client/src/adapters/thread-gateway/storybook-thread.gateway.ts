import { GetCommentsOptions, ThreadGateway } from 'frontend-domain';
import { CommentDto, ReactionTypeDto, ThreadDto } from 'shared';

import { gatewayAction } from '~/utils/gateway-action';

export class StorybookThreadGateway implements ThreadGateway {
  private action<T>(method: string, args: unknown[], result: T) {
    return gatewayAction(this, method, args, result);
  }

  getLast(count: number): Promise<ThreadDto[]> {
    return this.action('getLast', [count], []);
  }

  getById(threadId: string): Promise<[ThreadDto, CommentDto[]] | undefined> {
    return this.action('getById', [threadId], undefined);
  }

  getComments(threadId: string, options?: GetCommentsOptions): Promise<CommentDto[] | undefined> {
    return this.action('getComments', [threadId, options], undefined);
  }

  createThread(description: string, text: string, keywords: string[]): Promise<string> {
    return this.action('createComments', [description, text, keywords], '');
  }

  createComment(threadId: string, text: string): Promise<string> {
    return this.action('createComments', [threadId, text], '');
  }

  createReply(threadId: string, parentId: string, text: string): Promise<string> {
    return this.action('createComments', [threadId, parentId, text], '');
  }

  editComment(commentId: string, text: string): Promise<void> {
    return this.action('editComment', [commentId, text], undefined);
  }

  setReaction(commentId: string, reactionType: ReactionTypeDto | null): Promise<void> {
    return this.action('setReaction', [commentId, reactionType], undefined);
  }

  reportComment(commentId: string, reason?: string | undefined): Promise<void> {
    return this.action('reportComment', [commentId, reason], undefined);
  }
}
