import { headers } from 'next/headers';
import { useDispatch } from 'react-redux';

import { api } from '~/adapters';
import { Link } from '~/components/elements/link';

// import { ThreadForm } from '~/components/domain/thread/thread-form';

const ThreadsPage = async () => {
  const { threadGateway } = api(headers().get('Cookie'));
  const [thread] = await threadGateway.getLast(3);
  const dispatch = useDispatch();

  const handleSubmit = (form: ThreadFormType) => {
    dispatch(createNewThread(form));
  };

  const handleChange = (field: FormField<ThreadFormType>) => {
    if (errors[field]) {
      dispatch(clearThreadFormFieldError(field));
    }
  };

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
