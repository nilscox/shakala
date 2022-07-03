import { GetCommentsOptions, ThreadGateway } from 'frontend-domain';
import { CommentDto, ThreadDto } from 'shared';

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

  createComment(threadId: string, text: string): Promise<string> {
    return this.action('createComments', [threadId, text], '');
  }

  createReply(threadId: string, parentId: string, text: string): Promise<string> {
    return this.action('createComments', [threadId, parentId, text], '');
  }
}
