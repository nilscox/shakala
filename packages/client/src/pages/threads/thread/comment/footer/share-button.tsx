import { CommentDto } from '@shakala/shared';

import { SearchParamLink } from '~/elements/link';
import ShareIcon from '~/icons/share.svg';

type ShareButtonProps = {
  comment: CommentDto;
};

export const ShareButton = ({ comment }: ShareButtonProps) => (
  <SearchParamLink
    param="share"
    value={comment.id}
    className="row button-secondary button items-center fill-muted p-0 text-xs hover:fill-primary hover:text-primary"
  >
    <ShareIcon className="mr-0.5 h-4 w-4" /> Partager
  </SearchParamLink>
);
