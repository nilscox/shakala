import { createNormalizedActions } from '@nilscox/redux-query';
import { CommentDto, ThreadDto } from 'shared';

import { Comment, Thread } from '../../../types';

const { setEntity } = createNormalizedActions<Thread>('thread');

export const setThread = (threadDto: ThreadDto, commentDtos: CommentDto[]) => {
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

  return setEntity({
    ...threadDto,
    comments,
    createCommentForm: {
      open: true,
      text: '',
      submitting: false,
    },
  });
};
