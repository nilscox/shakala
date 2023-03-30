import { CommentDto, isReply } from '@shakala/shared';

import { TOKENS } from '~/app/tokens';
import { invalidateQuery, useMutate } from '~/hooks/use-mutate';
import { useRouteParam } from '~/hooks/use-route-params';
import IconSubscribe from '~/icons/subscribe.svg';

import { FooterButton } from './footer-button';

type SubscribeButtonProps = {
  comment: CommentDto;
};

export const SubscribeButton = ({ comment }: SubscribeButtonProps) => {
  const threadId = useRouteParam('threadId');

  const subscribe = useMutate(TOKENS.comment, 'setSubscription', {
    invalidate: invalidateQuery(TOKENS.thread, 'getThread', threadId),
  });

  const canSubscribe = !isReply(comment);

  if (!canSubscribe) {
    return null;
  }

  return (
    <FooterButton
      icon={<IconSubscribe />}
      active={comment.isSubscribed}
      onClick={() => subscribe(comment.id, !comment.isSubscribed)}
    >
      {comment.isSubscribed ? 'Suivi' : 'Suivre'}
    </FooterButton>
  );
};
