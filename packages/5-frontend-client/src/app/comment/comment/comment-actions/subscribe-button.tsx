import { commentSelectors } from 'frontend-domain';

import { useSnackbar } from '~/elements/snackbar';
import { useAppSelector } from '~/hooks/use-app-selector';
import SubscribeIcon from '~/icons/subscribe.svg';

import { FooterButton } from '../components/footer-button';

type SubscribeButtonProps = {
  commentId: string;
};
export const SubscribeButton = ({ commentId }: SubscribeButtonProps) => {
  const snackbar = useSnackbar();
  const canSubscribe = useAppSelector(commentSelectors.canSubscribe, commentId);
  const isSubscribed = useAppSelector(commentSelectors.isSubscribed, commentId);

  if (!canSubscribe) {
    return null;
  }

  return (
    <FooterButton
      icon={<SubscribeIcon />}
      active={isSubscribed}
      onClick={() => snackbar.warning("Cette fonctionnalité n'est pas encore disponible")}
    >
      {isSubscribed ? 'Suivi' : 'Suivre'}
    </FooterButton>
  );
};
