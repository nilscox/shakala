import { fetchAuthenticatedUser, fetchThreadById, selectThreadUnsafe } from 'frontend-domain';
import { useRouter } from 'next/router';

import { Thread } from '~/app/thread';
import { useAppSelector } from '~/hooks/use-app-selector';
import { ssr } from '~/utils/ssr';

type Params = {
  'thread-id': string;
};

export const getServerSideProps = ssr<Params>(async (store, { params }) => {
  const threadId = params?.['thread-id'] as string;

  await store.dispatch(fetchAuthenticatedUser());
  await store.dispatch(fetchThreadById(threadId));
});

const ThreadPage = () => {
  const router = useRouter();
  const threadId = router.query['thread-id'] as string;

  const thread = useAppSelector(selectThreadUnsafe, threadId);

  if (!thread) {
    return <>not found</>;
  }

  return <Thread threadId={threadId} />;
};

export default ThreadPage;
