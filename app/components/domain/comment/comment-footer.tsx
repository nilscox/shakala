import cx from 'classnames';

import { IconButton, IconButtonProps } from '~/components/elements/icon-button';
import { EditIcon } from '~/components/icons/edit';
import { HorizontalDotsIcon } from '~/components/icons/horizontal-dots';
import { ReplyIcon } from '~/components/icons/reply';
import { ReportIcon } from '~/components/icons/report';
import { ShareIcon } from '~/components/icons/share';
import { SubscribeIcon } from '~/components/icons/subscribe';
import { ThumbDownIcon } from '~/components/icons/thumb-down';
import { ThumbUpIcon } from '~/components/icons/thumb-up';

import { RepliesButton } from './replies-button';

type CommentFooterProps = {
  upvotes: number;
  downvotes: number;
  repliesCount: number;
  repliesOpen: boolean;
  hover: boolean;
  showActions: boolean;
  onShowActions: () => void;
  onToggleRepliesOpen: () => void;
};

export const CommentFooter = ({
  upvotes,
  downvotes,
  repliesCount,
  repliesOpen,
  hover,
  showActions,
  onShowActions,
  onToggleRepliesOpen,
}: CommentFooterProps) => (
  <div className="flex flex-row justify-between pt-1">
    <div className="flex flex-row gap-x-2">
      <FooterButton quiet={!hover} icon={<ThumbUpIcon />}>
        {upvotes}
      </FooterButton>

      <FooterButton quiet={!hover} icon={<ThumbDownIcon />}>
        {downvotes}
      </FooterButton>

      {showActions && (
        <>
          <FooterButton quiet={!hover} icon={<EditIcon />}>
            Éditer
          </FooterButton>

          <FooterButton quiet={!hover} icon={<SubscribeIcon />}>
            Suivre
          </FooterButton>

          <FooterButton quiet={!hover} icon={<ReportIcon />}>
            Signaler
          </FooterButton>

          <FooterButton quiet={!hover} icon={<ShareIcon />}>
            Partager
          </FooterButton>
        </>
      )}

      {!showActions && <FooterButton icon={<HorizontalDotsIcon />} onClick={onShowActions} />}

      <svg width="2" height="24" viewBox="0 0 2 24" fill="none" className="stroke-light-gray">
        <path d="M 0 0 V 24" strokeWidth="3" strokeLinecap="round" />
      </svg>

      <RepliesButton repliesCount={repliesCount} repliesOpen={repliesOpen} onClick={onToggleRepliesOpen} />
    </div>

    <FooterButton icon={<ReplyIcon />} className={cx(!hover && 'opacity-0 transition-opacity')}>
      Répondre
    </FooterButton>
  </div>
);

type FooterButtonProps = IconButtonProps & {
  quiet?: boolean;
};

export const FooterButton = ({ quiet, className, ...props }: FooterButtonProps) => (
  <IconButton small className={cx('transition-opacity', quiet && 'opacity-60', className)} {...props} />
);
