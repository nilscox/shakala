import { ThreadDto } from 'shared';

import { Thread } from '../../types';

export const threadDtoToEntity = (dto: ThreadDto): Thread => {
  return {
    ...dto,
    loadingComments: false,
    comments: [],
    createCommentForm: {
      isSubmitting: false,
      text: '',
    },
  };
};
