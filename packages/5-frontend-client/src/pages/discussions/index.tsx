import { threadActions, threadSelectors } from '@shakala/frontend-domain';

import { ThreadForm } from '~/app/thread/thread-form';
import { Link } from '~/elements/link';
import { useAppSelector } from '~/hooks/use-app-selector';
import { ssr } from '~/utils/ssr';

export const getServerSideProps = ssr(async (store) => {
  await store.dispatch(threadActions.fetchLastThreads(3));
});

const ThreadsPage = () => {
  const [thread] = useAppSelector(threadSelectors.nLastThreads, 1);

  return (
    <>
      <h2>Psst... ce projet n'existe pas vraiment !</h2>

      <p>
        Il s'agit d'un "proof of concept", un site permettant de se rendre compte de ce à quoi pourrait
        ressembler une plateforme comme Shakala. Il n'y a donc pas de communauté active qui fait vivre les
        discussions... pour l'instant !
      </p>

      <p>
        Si ce projet vous plaît et que vous pensez qu'il devrait voir le jour (pour de vrai), envoyez-nous un
        petit message pour nous montrer votre soutien !
      </p>

      {thread && (
        <p>
          En attendant, vous pouvez voir à quoi pourrait ressembler une discussion{' '}
          <Link href={`/discussions/${thread.id}`}>sur cette page</Link>.
        </p>
      )}

      <h2>Créer un nouveau fil de discussion</h2>

      <ThreadForm />
    </>
  );
};

export default ThreadsPage;
