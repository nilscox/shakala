import { PageTitle } from '~/app/page-title';
import { Link } from '~/elements/link';
import NotFoundImage from '~/images/page-not-found.svg';

export default function PageNotFound() {
  return (
    <>
      <PageTitle>404 - Cette page n'existe pas</PageTitle>
      <h1 className="text-center">Cette page n'existe pas</h1>
      <Link href="/" className="block text-center">
        Retour sur une page qui existe
      </Link>
      <NotFoundImage className="m-auto my-6 max-w-1 rounded-lg" />
    </>
  );
}
