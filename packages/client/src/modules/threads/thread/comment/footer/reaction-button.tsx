import { CommentDto, ReactionType } from '@shakala/shared';

import { TOKENS } from '~/app/tokens';
import { useMutate } from '~/hooks/use-mutate';
import { useRouteParam } from '~/hooks/use-route-params';
import { useUser } from '~/hooks/use-user';
import ThumbDownIcon from '~/icons/thumb-down.svg';
import ThumbUpIcon from '~/icons/thumb-up.svg';
import { getQueryKey } from '~/utils/query-key';

import { FooterButton } from './footer-button';

type ReactionButtonProps = {
  comment: CommentDto;
  reactionType: ReactionType;
  children: React.ReactNode;
};

export const ReactionButton = ({ comment, reactionType, children }: ReactionButtonProps) => {
  const user = useUser();

  const threadId = useRouteParam('threadId');
  const isAuthor = comment.author.id === user?.id;

  const setReaction = useMutate(TOKENS.comment, 'setReaction', {
    invalidate: getQueryKey(TOKENS.thread, 'getThread', threadId),
  });

  return (
    <FooterButton
      icon={reactionIconMap[reactionType]}
      active={comment.userReaction === reactionType}
      onClick={() => setReaction(comment.id, reactionType)}
      disabled={isAuthor}
      title={isAuthor ? 'Vous ne pouvez pas voter pour vos propres commentaires' : undefined}
    >
      {children}
    </FooterButton>
  );
};

const reactionIconMap: Record<ReactionType, JSX.Element> = {
  [ReactionType.upvote]: <ThumbUpIcon />,
  [ReactionType.downvote]: <ThumbDownIcon />,
};
