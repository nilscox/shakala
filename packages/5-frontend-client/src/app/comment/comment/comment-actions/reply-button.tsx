import { commentActions, commentSelectors } from 'frontend-domain';
import { useAppDispatch } from '~/hooks/use-app-dispatch';
import { useAppSelector } from '~/hooks/use-app-selector';
import ReplyIcon from '~/icons/reply.svg';
import { FooterButton } from '../components/footer-button';

type ReplyButtonProps = {
  commentId: string;
};
export const ReplyButton = ({ commentId }: ReplyButtonProps) => {
  const dispatch = useAppDispatch();
  const canReply = useAppSelector(commentSelectors.canReply, commentId);

  if (!canReply) {
    return null;
  }

  return (
    <FooterButton
      icon={<ReplyIcon />}
      onClick={() => dispatch(commentActions.setReplying(commentId, true))}
      title="Répondre"
      className="ml-auto pl-2"
    >
      <span className="xxs:block hidden">Répondre</span>
    </FooterButton>
  );
};
