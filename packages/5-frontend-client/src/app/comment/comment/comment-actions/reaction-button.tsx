import { commentActions, commentSelectors, ReactionType } from 'frontend-domain';

import { useAppDispatch } from '~/hooks/use-app-dispatch';
import { useAppSelector } from '~/hooks/use-app-selector';
import ThumbDownIcon from '~/icons/thumb-down.svg';
import ThumbUpIcon from '~/icons/thumb-up.svg';

import { FooterButton } from '../components/footer-button';

type ReactionButtonProps = {
  commentId: string;
  reactionType: ReactionType;
  children: React.ReactNode;
};

export const ReactionButton = ({ commentId, reactionType, children }: ReactionButtonProps) => {
  const dispatch = useAppDispatch();

  const { userReaction } = useAppSelector(commentSelectors.byId, commentId);
  const isAuthor = useAppSelector(commentSelectors.isAuthor, commentId);

  return (
    <FooterButton
      icon={reactionIconMap[reactionType]}
      active={userReaction === reactionType}
      onClick={() => dispatch(commentActions.setReaction(commentId, reactionType))}
      disabled={isAuthor}
      title={isAuthor ? "Vous ne pouvez pas voter pour un commentaire dont vous êtes l'auteur" : undefined}
    >
      {children}
    </FooterButton>
  );
};

const reactionIconMap: Record<ReactionType, JSX.Element> = {
  [ReactionType.upvote]: <ThumbUpIcon />,
  [ReactionType.downvote]: <ThumbDownIcon />,
};
