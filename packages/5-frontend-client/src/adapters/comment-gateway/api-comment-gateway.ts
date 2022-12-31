import { CommentGateway } from '@shakala/frontend-domain';
import {
  CreateReplyBodyDto,
  EditCommentBodyDto,
  ReactionTypeDto,
  ReportCommentBodyDto,
} from '@shakala/shared';

import { HttpGateway } from '../http-gateway/http.gateway';

export class ApiCommentGateway implements CommentGateway {
  constructor(private readonly http: HttpGateway) {}

  async createReply(parentId: string, text: string): Promise<string> {
    const response = await this.http.write<{ id: string }, CreateReplyBodyDto>(
      'post',
      `/comment/${parentId}/reply`,
      {
        body: { text },
      },
    );

    return response.body.id;
  }

  async editComment(commentId: string, text: string): Promise<void> {
    await this.http.write<void, EditCommentBodyDto>('put', `/comment/${commentId}`, {
      body: { text },
    });
  }

  async setReaction(commentId: string, type: ReactionTypeDto | null): Promise<void> {
    await this.http.write('put', `/comment/${commentId}/reaction`, {
      body: { type },
    });
  }

  async subscribe(commentId: string): Promise<void> {
    await this.http.write('post', `/comment/${commentId}/subscription`);
  }

  async unsubscribe(commentId: string): Promise<void> {
    await this.http.write('delete', `/comment/${commentId}/subscription`);
  }

  async reportComment(commentId: string, reason?: string | undefined): Promise<void> {
    await this.http.write<void, ReportCommentBodyDto>('post', `/comment/${commentId}/report`, {
      body: { reason },
    });
  }
}
