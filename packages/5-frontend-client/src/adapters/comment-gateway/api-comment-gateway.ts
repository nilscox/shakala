import { AuthorizationError, CommentAlreadyReportedError, CommentGateway } from 'frontend-domain';
import { CreateReplyBodyDto, EditCommentBodyDto, ReactionTypeDto, ReportCommentBodyDto } from 'shared';

import { ApiHttpError } from '../http-gateway/api-fetch-http.gateway';
import { HttpGateway } from '../http-gateway/http.gateway';

export class ApiCommentGateway implements CommentGateway {
  constructor(private readonly http: HttpGateway) {}

  async createReply(parentId: string, text: string): Promise<string> {
    const response = await this.http.post<{ id: string }, CreateReplyBodyDto>(`/comment/${parentId}/reply`, {
      body: { text },
    });

    return response.body.id;
  }

  async editComment(commentId: string, text: string): Promise<void> {
    await this.http.put<void, EditCommentBodyDto>(`/comment/${commentId}`, {
      body: { text },
      onError: (error) => {
        if (ApiHttpError.is(error, 'UserMustBeAuthor')) {
          throw new AuthorizationError('UserMustBeAuthor');
        }
      },
    });
  }

  async setReaction(commentId: string, type: ReactionTypeDto | null): Promise<void> {
    await this.http.put(`/comment/${commentId}/reaction`, {
      body: { type },
    });
  }

  async subscribe(commentId: string): Promise<void> {
    await this.http.post(`/comment/${commentId}/subscription`);
  }

  async unsubscribe(commentId: string): Promise<void> {
    await this.http.delete(`/comment/${commentId}/subscription`);
  }

  async reportComment(commentId: string, reason?: string | undefined): Promise<void> {
    await this.http.post<void, ReportCommentBodyDto>(`/comment/${commentId}/report`, {
      body: { reason },
      onError: (error) => {
        if (ApiHttpError.is(error, 'CommentAlreadyReported')) {
          throw new CommentAlreadyReportedError();
        }
      },
    });
  }
}
