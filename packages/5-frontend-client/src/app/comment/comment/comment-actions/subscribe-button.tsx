import { commentActions, commentSelectors } from 'frontend-domain';

import { useAppDispatch } from '~/hooks/use-app-dispatch';
import { useAppSelector } from '~/hooks/use-app-selector';
import SubscribeIcon from '~/icons/subscribe.svg';

import { FooterButton } from '../components/footer-button';

type SubscribeButtonProps = {
  commentId: string;
};

export const SubscribeButton = ({ commentId }: SubscribeButtonProps) => {
  const dispatch = useAppDispatch();

  const canSubscribe = useAppSelector(commentSelectors.canSubscribe, commentId);
  const isSubscribed = useAppSelector(commentSelectors.isSubscribed, commentId);

  if (!canSubscribe) {
    return null;
  }

  return (
    <FooterButton
      icon={<SubscribeIcon />}
      active={isSubscribed}
      onClick={() => dispatch(commentActions.toggleSubscription(commentId))}
    >
      {isSubscribed ? 'Suivi' : 'Suivre'}
    </FooterButton>
  );
};
