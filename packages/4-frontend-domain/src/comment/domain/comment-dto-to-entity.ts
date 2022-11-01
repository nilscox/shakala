import { CommentDto } from 'shared';

import { Comment } from '../../types';

export const createCommentForm = () => ({
  open: false,
  text: '',
  submitting: false,
});

export const commentDtoToEntity = (dto: CommentDto): Comment => {
  return {
    ...dto,
    replies: dto.replies?.map(commentDtoToEntity) ?? [],
    editionForm: createCommentForm(),
    replyForm: createCommentForm(),
  };
};
