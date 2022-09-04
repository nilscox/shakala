import { PageTitle } from '~/components/layout/page-title';
import notFoundImage from '~/images/404.png';

export const NotFoundRoute = () => (
  <>
    <PageTitle>Cette page n'existe pas</PageTitle>
    <h1 className="text-center">Cette page n'existe pas</h1>

    <img src={notFoundImage} alt="not found" className="m-auto my-6 max-w-1 rounded-lg border bg-neutral" />
  </>
);
