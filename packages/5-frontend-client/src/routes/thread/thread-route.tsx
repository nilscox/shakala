import {
  fetchThreadById,
  NotFound,
  selectIsLoadingThread,
  selectLoadingThreadError,
  selectThreadUnsafe,
} from 'frontend-domain';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Thread } from '~/components/domain/thread/thread';
import { AsyncResource } from '~/components/elements/async-resource/async-resource';
import { Fallback } from '~/components/elements/fallback';
import { useDispatch } from '~/hooks/use-dispatch';
import { useSelector } from '~/hooks/use-selector';
import { useUser } from '~/hooks/use-user';

export const ThreadRoute = () => {
  const params = useParams<{ threadId: string }>();
  const threadId = params.threadId as string;

  const dispatch = useDispatch();

  const thread = useSelector(selectThreadUnsafe, threadId);
  const loading = useSelector(selectIsLoadingThread, threadId);
  const error = useSelector(selectLoadingThreadError, threadId);

  const user = useUser();

  useEffect(() => {
    dispatch(fetchThreadById(threadId));
  }, [dispatch, threadId, user]);

  return (
    <AsyncResource
      data={thread}
      loading={loading}
      error={error}
      renderError={(error) => {
        if (error === NotFound) {
          return <Fallback>Ce thread n'existe pas.</Fallback>;
        }

        throw Object.assign(new Error(), error);
      }}
      render={() => <Thread threadId={threadId} />}
    />
  );
};
