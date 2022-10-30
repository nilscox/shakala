import { createNormalizedActions } from '@nilscox/redux-query';
import { CommentDto, ThreadDto } from 'shared';

import { Comment, Thread } from '../../../types';

const { setEntity, setEntities } = createNormalizedActions<Thread>('thread');

const transformThread = (threadDto: ThreadDto, commentDtos: CommentDto[]): Thread => {
  const comments: Comment[] = commentDtos.map((comment) => ({
    ...comment,
    replies:
      comment.replies?.map((reply) => ({
        ...reply,
        replies: [],
        replyForm: {
          open: false,
          text: '',
          submitting: false,
        },
        editionForm: {
          open: false,
          text: '',
          submitting: false,
        },
      })) ?? [],
    replyForm: {
      open: false,
      text: '',
      submitting: false,
    },
    editionForm: {
      open: false,
      text: '',
      submitting: false,
    },
  }));

  return {
    ...threadDto,
    comments,
    createCommentForm: {
      open: true,
      text: '',
      submitting: false,
    },
  };
};

export const setThread = (threadDto: ThreadDto, commentDtos: CommentDto[]) => {
  return setEntity(transformThread(threadDto, commentDtos));
};

export const setThreads = (threadDtos: ThreadDto[]) => {
  return setEntities(threadDtos.map((thread) => transformThread(thread, [])));
};
