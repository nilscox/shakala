import { first } from '@shakala/shared';
import { useInjection } from 'brandi-react';

import { TOKENS } from '~/app/tokens';
import { Link } from '~/elements/link';
import { useQuery } from '~/hooks/use-query';
import { prefetchQuery } from '~/utils/prefetch-query';

import { ThreadForm } from './thread-form';

export const queries = [prefetchQuery(TOKENS.thread, 'getLastThreads', 1)];

export { ThreadsListPage as Page };

const ThreadsListPage = () => {
  const router = useInjection(TOKENS.router);
  const thread = useInjection(TOKENS.thread);

  return (
    <>
      <h2>Psst... ce projet est en développement !</h2>

      <p>
        Plus tard, vous trouverez sur cette page la liste des fils de discussion, et pourrez effectuer une
        recherche par catégorie ou par mots clés. Pour l'instant, vous pouvez juste créer une nouvelle
        discussion :)
      </p>

      <ThreadLink />

      <h2>Créer un nouveau fil de discussion</h2>

      <ThreadForm
        submitButtonText="Créer"
        onSubmit={(fields) => thread.createThread(fields)}
        onSubmitted={(threadId) => router.navigate(`/discussions/${threadId}`)}
      />
    </>
  );
};

const ThreadLink = () => {
  const thread = first(useQuery(TOKENS.thread, 'getLastThreads', 1));

  if (!thread) {
    return null;
  }

  return (
    <p>
      En attendant, vous pouvez voir à quoi pourrait ressembler une discussion{' '}
      <Link href={`/discussions/${thread.id}`}>sur cette page</Link>.
    </p>
  );
};
