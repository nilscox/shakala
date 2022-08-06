import {
  clearThreadFormFieldError,
  createNewThread,
  FormField,
  selectCreateThreadFieldErrors,
  ThreadForm as ThreadFormType,
} from 'frontend-domain';
import { Link } from 'react-router-dom';

import { ThreadForm } from '~/components/domain/thread/thread-form';
import { useDispatch } from '~/hooks/use-dispatch';
import { useSelector } from '~/hooks/use-selector';

export const ThreadsRoute = () => {
  const dispatch = useDispatch();

  const errors = useSelector(selectCreateThreadFieldErrors);

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
      <h2 className="py-4 text-lg">Psst... ce projet n'existe pas vraiment !</h2>

      <p>
        Il s'agit d'un "proof of concept", un site permettant de se rendre compte de ce à quoi pourrait
        ressembler une plateforme comme Shakala. Il n'est donc pas possible de s'inscrire ou de publier de
        nouveaux messages... pour l'instant !
      </p>

      <p>
        Si ce projet vous plaît et que vous pensez qu'il devrait voir le jour (pour de vrai), envoyez-nous un
        petit message pour nous montrer votre soutien !
      </p>

      <p>
        En attendant, vous pouvez voir à quoi pourrait ressembler une discussion{' '}
        <Link to="/discussions/38pvde">sur cette page</Link>, dont les messages viennent de la page facebook
        du groupe zététique.
      </p>

      <h2 className="py-6 text-xxl">Créer un nouveau fil de discussion</h2>

      <ThreadForm errors={errors} onChange={handleChange} onSubmit={handleSubmit} />
    </>
  );
};
