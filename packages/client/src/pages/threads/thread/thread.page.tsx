import { TOKENS } from '~/app/tokens';

import { useQuery } from '../../../hooks/use-query';
import { useRouteParam } from '../../../hooks/use-route-params';
import { prefetchQuery } from '../../../utils/prefetch-query';

import { Thread } from './thread';

export const queries = [
  prefetchQuery(({ routeParams }) => [TOKENS.thread, 'getThread', routeParams.threadId]),
  prefetchQuery(({ urlParsed }) => {
    const searchParams = new URLSearchParams(urlParsed.searchOriginal ?? '');
    const share = searchParams.get('share');

    if (share) {
      return [TOKENS.comment, 'getComment', share];
    }
  }),
];

export { ThreadPage as Page };

const ThreadPage = () => {
  const threadId = useRouteParam('threadId');
  const thread = useQuery(TOKENS.thread, 'getThread', threadId);

  if (!thread) {
    return <>thread not found</>;
  }

  return <Thread thread={thread} />;
};
