import EditIcon from '~/icons/edit.svg';

import { FooterButton } from './footer-button';

type EditCommentProps = {
  onClick: () => void;
};

export const EditButton = ({ onClick }: EditCommentProps) => (
  <FooterButton icon={<EditIcon />} onClick={onClick}>
    Éditer
  </FooterButton>
);
