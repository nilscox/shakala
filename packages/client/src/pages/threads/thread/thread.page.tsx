import { di } from '../../../di';
import { useQuery } from '../../../hooks/use-query';
import { useRouteParam } from '../../../hooks/use-route-params';
import { prefetchQuery } from '../../../utils/prefetch-query';

export const queries = [prefetchQuery(di.thread, 'getThread', 'man2dsh83ser')];

export { ThreadPage as Page };

const ThreadPage = () => {
  const threadId = useRouteParam('threadId');
  const thread = useQuery(di.thread, 'getThread', threadId);

  if (!thread) {
    return <>thread not found</>;
  }

  return <>thread {thread.id}</>;
};
