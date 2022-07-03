import { CommentDto } from 'shared';

import { Comment } from '../../types';

export const commentDtoToEntity = (dto: CommentDto): Comment => {
  return {
    ...dto,
    replies: dto.replies?.map(commentDtoToEntity).map(({ id }) => id) ?? [],
    isEditing: false,
  };
};
