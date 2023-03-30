import { CommentDto } from '@shakala/shared';

import HistoryIcon from '~/icons/history.svg';

import { FooterButtonLink } from './footer-button';

type HistoryButtonProps = {
  comment: CommentDto;
};

export const HistoryButton = ({ comment }: HistoryButtonProps) => (
  <FooterButtonLink
    param="historique"
    value={comment.id}
    disabled={comment.edited === false}
    title={comment.edited === false ? "Ce commentaire n'a pas été édité" : undefined}
    icon={<HistoryIcon className="mr-0.5 h-4 w-4" />}
  >
    Historique
  </FooterButtonLink>
);
