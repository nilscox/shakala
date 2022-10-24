import { PageTitle } from '~/components/layout/page-title';
import NotFoundImage from '~/images/page-not-found.svg';

import { Link } from '../components/elements/link';

export const NotFoundRoute = () => (
  <>
    <PageTitle>404 - Cette page n'existe pas</PageTitle>
    <h1 className="text-center">Cette page n'existe pas</h1>
    <Link to="/" className="block text-center">
      Retour sur une page qui existe
    </Link>
    <NotFoundImage className="m-auto my-6 max-w-1 rounded-lg" />
  </>
);
