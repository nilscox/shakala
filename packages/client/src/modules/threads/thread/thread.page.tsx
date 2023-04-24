import { isCommentSort } from '@shakala/shared';

import { TOKENS } from '~/app/tokens';
import { Fallback } from '~/elements/fallback';
import { Link } from '~/elements/link';
import { useQuery } from '~/hooks/use-query';
import { useRouteParam } from '~/hooks/use-route-params';
import IconChevronLeft from '~/icons/chevron-left.svg';
import { prefetchQuery } from '~/utils/prefetch-query';
import { withSuspense } from '~/utils/with-suspense';

import { CommentHistoryModal } from './modals/comment-history-modal/comment-history-modal';
import { ReportCommentModal } from './modals/report-comment-modal/report-comment-modal';
import { ShareCommentModal } from './modals/share-comment-modal';
import { Thread } from './thread';

export const queries = [
  prefetchQuery(({ routeParams }) => {
    return [TOKENS.thread, 'getThread', routeParams.threadId];
  }),
  prefetchQuery(({ routeParams, urlParsed }) => {
    const params = new URLSearchParams(urlParsed.searchOriginal ?? '');
    const search = params.get('search') ?? undefined;
    const sortParam = params.get('sort') ?? undefined;
    const sort = isCommentSort(sortParam) ? sortParam : undefined;

    return [TOKENS.thread, 'getThreadComments', routeParams.threadId, { search, sort }];
  }),
  prefetchQuery(({ urlParsed }) => {
    const searchParams = new URLSearchParams(urlParsed.searchOriginal ?? '');
    const share = searchParams.get('share');

    if (share) {
      return [TOKENS.comment, 'getComment', share];
    }
  }),
];

export { ThreadPage as Page };

const ThreadPage = withSuspense(() => {
  const threadId = useRouteParam('threadId');
  const thread = useQuery(TOKENS.thread, 'getThread', threadId);

  if (!thread) {
    return <ThreadNotFound />;
  }

  return (
    <>
      <Thread thread={thread} />

      <CommentHistoryModal />
      <ReportCommentModal />
      <ShareCommentModal />
    </>
  );
});

const ThreadNotFound = () => (
  <Fallback>
    Ce fil de discussion n'existe pas (ou plus).
    <Link href="/" className="row gap-1">
      <IconChevronLeft className="w-2" /> Retour
    </Link>
  </Fallback>
);
