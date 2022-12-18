import { Comment, FetchCommentsFilters, Reply, Thread, ThreadGateway } from 'frontend-domain';
import {
  CommentDto,
  CreateCommentBodyDto,
  CreateThreadBodyDto,
  GetLastThreadsQueryDto,
  GetThreadQueryDto,
  ThreadDto,
  ThreadWithCommentsDto,
} from 'shared';

import { HttpGateway, Response } from '../http-gateway/http.gateway';

export class FetchError extends Error {
  constructor(public readonly response: Response<unknown>) {
    super('FetchError');
  }
}

export class ApiThreadGateway implements ThreadGateway {
  constructor(private readonly http: HttpGateway) {}

  private transformCommentDto = (commentDto: CommentDto): Comment => {
    return {
      ...commentDto,
      editing: false,
      replying: false,
      replies: (commentDto.replies ?? []).map(this.transformReplyDto),
    };
  };

  private transformReplyDto = (replyDto: CommentDto): Reply => {
    return {
      ...replyDto,
      editing: false,
    };
  };

  async fetchLast(count: number): Promise<Thread[]> {
    const response = await this.http.get<ThreadDto[], GetLastThreadsQueryDto>('/thread/last', {
      query: { count },
    });

    return response.body.map((dto) => ({
      ...dto,
      comments: [],
    }));
  }

  async fetchThread(threadId: string): Promise<Thread | undefined> {
    const { body } = await this.http.get<ThreadWithCommentsDto | undefined>(`/thread/${threadId}`, {
      onError(error) {
        if (error.status === 404) {
          return undefined;
        }

        throw error;
      },
    });

    if (!body) {
      return;
    }

    return {
      ...body,
      comments: body.comments.map(this.transformCommentDto),
    };
  }

  async fetchComments(threadId: string, options: FetchCommentsFilters): Promise<Comment[]> {
    const response = await this.http.get<ThreadWithCommentsDto, GetThreadQueryDto>(`/thread/${threadId}`, {
      query: options as GetThreadQueryDto,
    });

    return response.body.comments.map(this.transformCommentDto);
  }

  async createThread(description: string, keywords: string[], text: string): Promise<string> {
    const response = await this.http.post<{ id: string }, CreateThreadBodyDto>('/thread', {
      body: { description, text, keywords },
    });

    if (response.status !== 201) {
      throw new FetchError(response);
    }

    return response.body.id;
  }

  async createComment(threadId: string, text: string): Promise<string> {
    const response = await this.http.post<{ id: string }, CreateCommentBodyDto>('/comment', {
      body: { threadId, text },
    });

    if (response.status !== 201) {
      throw new FetchError(response);
    }

    return response.body.id;
  }
}
