import { SearchParamLink } from '~/elements/search-param-link';
import ShareIcon from '~/icons/share.svg';

type ShareButtonProps = {
  commentId: string;
};

export const ShareButton = ({ commentId }: ShareButtonProps) => {
  return (
    <SearchParamLink
      param="share"
      value={commentId}
      className="row button-secondary button items-center fill-muted p-0 text-xs hover:fill-primary hover:text-primary"
    >
      <ShareIcon className="mr-0.5 h-4 w-4" /> Partager
    </SearchParamLink>
  );
};
