import { CommentDto } from '@shakala/shared';
import { useEffect } from 'react';

import { useSnackbar } from '~/elements/snackbar';
import { useQuery } from '~/hooks/use-query';
import { withSuspense } from '~/utils/with-suspense';

type FetchCommentProps = {
  commentId: string;
  onNotFound: () => void;
  children: (comment: CommentDto) => React.ReactElement;
};

export const FetchComment = withSuspense(({ commentId, onNotFound, children }: FetchCommentProps) => {
  const snackbar = useSnackbar();
  const comment = useQuery(TOKENS.comment, 'getComment', commentId);

  useEffect(() => {
    if (!comment) {
      snackbar.warning(`Le commentaire identifié "${commentId}" n'a pas été trouvé`);
      onNotFound();
    }
  }, [comment, commentId, snackbar, onNotFound]);

  if (!comment) {
    return null;
  }

  return children(comment);
});
