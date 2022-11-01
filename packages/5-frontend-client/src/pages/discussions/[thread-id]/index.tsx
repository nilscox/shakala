import {
  createStore,
  fetchAuthenticatedUser,
  fetchThreadById,
  selectThreadUnsafe,
  State,
} from 'frontend-domain';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import { Thread } from '~/app/thread';
import { useAppSelector } from '~/hooks/use-app-selector';
import { productionDependencies } from '~/utils/production-dependencies';

type ThreadPageProps = {
  state: State;
};

type Params = {
  'thread-id': string;
};

export const getServerSideProps: GetServerSideProps<ThreadPageProps, Params> = async ({ params }) => {
  const threadId = params?.['thread-id'] as string;

  const store = createStore(productionDependencies);

  await store.dispatch(fetchAuthenticatedUser());
  await store.dispatch(fetchThreadById(threadId));

  return {
    props: {
      state: store.getState(),
    },
  };
};

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
