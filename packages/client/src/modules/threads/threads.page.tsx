import { first } from '@shakala/shared';
import { useInjection } from 'brandi-react';

import { TOKENS } from '~/app/tokens';
import { Link } from '~/elements/link';
import { useQuery } from '~/hooks/use-query';
import { prefetchQuery } from '~/utils/prefetch-query';
import { withSuspense } from '~/utils/with-suspense';

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
        Il s'agit d'un "proof of concept", un site permettant de se rendre compte de ce à quoi pourrait
        ressembler une plateforme comme Shakala. Il n'y a donc pas de communauté active qui fait vivre les
        discussions... pour l'instant !
      </p>

      <p>
        Si ce projet vous plaît et que vous pensez qu'il devrait voir le jour (pour de vrai), envoyez-nous un
        petit message pour nous montrer votre soutien !
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

const ThreadLink = withSuspense(() => {
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
}, 'ThreadLink');
