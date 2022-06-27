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
import { Fallback } from '~/components/elements/fallback';
import { useDispatch } from '~/hooks/use-dispatch';
import { useSelector } from '~/hooks/use-selector';

import { AsyncResource } from '../../async-resource';

export const ThreadRoute = () => {
  const params = useParams<{ threadId: string }>();
  const threadId = params.threadId as string;

  const thread = useSelector(selectThreadUnsafe, threadId);
  const loading = useSelector(selectIsLoadingThread, threadId);
  const error = useSelector(selectLoadingThreadError, threadId);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchThreadById(threadId));
  }, [dispatch, threadId]);

  return (
    <AsyncResource
      data={thread}
      loading={loading}
      error={error}
      renderError={(error) => {
        if (error === NotFound) {
          return <Fallback>Ce thread n'existe pas.</Fallback>;
        }

        throw error;
      }}
      render={() => <Thread threadId={threadId} />}
    />
  );
};
