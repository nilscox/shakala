import { commentActions } from '@shakala/frontend-domain';

import { useAppDispatch } from '~/hooks/use-app-dispatch';
import EditIcon from '~/icons/edit.svg';

import { FooterButton } from '../components/footer-button';

type EditCommentProps = {
  commentId: string;
};

export const EditButton = ({ commentId }: EditCommentProps) => {
  const dispatch = useAppDispatch();

  return (
    <FooterButton icon={<EditIcon />} onClick={() => dispatch(commentActions.setEditing(commentId, true))}>
      Éditer
    </FooterButton>
  );
};
