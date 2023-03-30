import {
  CommentDto,
  CreateCommentBody,
  EditCommentBody,
  Maybe,
  ReactionType,
  ReportCommentBody,
  SetReactionBody,
} from '@shakala/shared';
import { injected } from 'brandi';

import { HttpPort } from '~/adapters/http/http.port';
import { TOKENS } from '~/app/tokens';

import { CommentPort } from './comment.port';

export class ApiCommentAdapter implements CommentPort {
  constructor(private readonly http: HttpPort) {}

  async getComment(commentId: string): Promise<Maybe<CommentDto>> {
    const { body } = await this.http.get<CommentDto>(`/comment/${commentId}`);
    return body;
  }

  async createComment(threadId: string, text: string): Promise<string> {
    const { body } = await this.http.post<CreateCommentBody, string>(`/thread/${threadId}/comment`, {
      text,
    });
    return body;
  }

  async createReply(parentId: string, text: string): Promise<string> {
    const { body } = await this.http.post<CreateCommentBody, string>(`/comment/${parentId}/reply`, {
      text,
    });
    return body;
  }

  async editComment(commentId: string, text: string): Promise<void> {
    await this.http.put<EditCommentBody>(`/comment/${commentId}`, { text });
  }

  async setReaction(commentId: string, reaction: ReactionType | null): Promise<void> {
    await this.http.post<SetReactionBody>(`/comment/${commentId}/reaction`, { type: reaction });
  }

  async setSubscription(commentId: string, subscribed: boolean): Promise<void> {
    await this.http.post(
      subscribed ? `/comment/${commentId}/subscribe` : `/comment/${commentId}/unsubscribe`
    );
  }

  async reportComment(commentId: string, reason?: string): Promise<void> {
    await this.http.post<ReportCommentBody>(`/comment/${commentId}/report`, { reason });
  }
}

injected(ApiCommentAdapter, TOKENS.http);
