import { threadActions, threadSelectors } from '@shakala/frontend-domain';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { Thread } from '~/app/thread';
import { Fallback } from '~/elements/fallback';
import { useAppDispatch } from '~/hooks/use-app-dispatch';
import { useAppSelector } from '~/hooks/use-app-selector';
import { ssr } from '~/utils/ssr';

type Params = {
  'thread-id': string;
};

export const getServerSideProps = ssr<Params>(async (store, { params }) => {
  const threadId = params?.['thread-id'] as string;

  await store.dispatch(threadActions.fetchThread(threadId));
});

const ThreadPage = () => {
  const router = useRouter();
  const threadId = router.query['thread-id'] as string;

  const dispatch = useAppDispatch();
  const thread = useAppSelector(threadSelectors.byId.unsafe, threadId);

  useEffect(() => {
    dispatch(threadActions.fetchThread(threadId));
  }, [dispatch, threadId]);

  if (!thread) {
    return <Fallback>Ce fil de discussion n'existe pas (ou n'existe plus).</Fallback>;
  }

  return <Thread threadId={threadId} />;
};

export default ThreadPage;
