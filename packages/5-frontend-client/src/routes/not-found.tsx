import notFoundImage from '~/images/404.png';

import { PageTitle } from './components/page-title';

export const NotFoundRoute = () => (
  <>
    <PageTitle className="text-center">Cette page n'existe pas</PageTitle>

    <img
      src={notFoundImage}
      alt="not found"
      // eslint-disable-next-line tailwindcss/no-arbitrary-value
      className="m-auto my-6 max-w-[16rem] bg-neutral rounded-lg border"
    />
  </>
);
