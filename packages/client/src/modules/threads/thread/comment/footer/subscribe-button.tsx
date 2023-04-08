import { CommentDto, isReply } from '@shakala/shared';

import { TOKENS } from '~/app/tokens';
import { useMutate } from '~/hooks/use-mutate';
import { useInvalidateQuery } from '~/hooks/use-query';
import { useRouteParam } from '~/hooks/use-route-params';
import IconSubscribe from '~/icons/subscribe.svg';
import { getQueryKey } from '~/utils/query-key';

import { FooterButton } from './footer-button';

type SubscribeButtonProps = {
  comment: CommentDto;
};

export const SubscribeButton = ({ comment }: SubscribeButtonProps) => {
  const threadId = useRouteParam('threadId');

  const invalidate = useInvalidateQuery();

  const subscribe = useMutate(TOKENS.comment, 'setSubscription', {
    onSuccess: () => invalidate(getQueryKey(TOKENS.thread, 'getThreadComments', threadId)),
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
