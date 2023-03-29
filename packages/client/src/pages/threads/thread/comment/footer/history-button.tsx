import { CommentDto } from '@shakala/shared';
import { clsx } from 'clsx';

import { SearchParamLink } from '~/elements/link';
import HistoryIcon from '~/icons/history.svg';

type HistoryButtonProps = {
  comment: CommentDto;
};

export const HistoryButton = ({ comment }: HistoryButtonProps) => (
  <SearchParamLink
    param="historique"
    value={comment.id}
    disabled={comment.edited === false}
    title={comment.edited === false ? "Ce commentaire n'a pas été édité" : undefined}
    className={clsx(
      'row button-secondary button items-center fill-muted p-0 text-xs hover:fill-primary hover:text-primary',
      comment.edited === false && 'cursor-default text-muted/60 hover:text-muted/60'
    )}
  >
    <HistoryIcon className="mr-0.5 h-4 w-4" />
    Historique
  </SearchParamLink>
);
