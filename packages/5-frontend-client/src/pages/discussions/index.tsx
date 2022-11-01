import {
  createStore,
  fetchAuthenticatedUser,
  fetchLastThreads,
  selectLastThreads,
  State,
} from 'frontend-domain';
import { GetServerSideProps } from 'next';

import { Link } from '~/elements/link';

import { useAppSelector } from '../../hooks/use-app-selector';
import { productionDependencies } from '../../utils/production-dependencies';

// import { ThreadForm } from '~/components/domain/thread/thread-form';

type ThreadsPageProps = {
  state: State;
};

export const getServerSideProps: GetServerSideProps<ThreadsPageProps> = async () => {
  const store = createStore(productionDependencies);

  await store.dispatch(fetchAuthenticatedUser());
  await store.dispatch(fetchLastThreads());

  return {
    props: {
      state: store.getState(),
    },
  };
};

const ThreadsPage = () => {
  const [thread] = useAppSelector(selectLastThreads);

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

      {/* <ThreadForm errors={errors} onChange={handleChange} onSubmit={handleSubmit} /> */}
    </>
  );
};

export default ThreadsPage;
