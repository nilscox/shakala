import { clsx } from 'clsx';
import { commentSelectors } from 'frontend-domain';

import { SearchParamLink } from '~/elements/search-param-link';
import { useAppSelector } from '~/hooks/use-app-selector';
import HistoryIcon from '~/icons/history.svg';

type HistoryButtonProps = {
  commentId: string;
};

export const HistoryButton = ({ commentId }: HistoryButtonProps) => {
  const { edited } = useAppSelector(commentSelectors.byId, commentId);

  return (
    <SearchParamLink
      param="historique"
      value={commentId}
      disabled={edited === false}
      title={edited === false ? "Ce commentaire n'a pas été édité" : undefined}
      className={clsx(
        'row button-secondary button items-center fill-muted p-0 text-xs hover:fill-primary hover:text-primary',
        edited === false && 'cursor-default text-muted/60 hover:text-muted/60',
      )}
    >
      <HistoryIcon className="mr-0.5 h-4 w-4" />
      Historique
    </SearchParamLink>
  );
};
