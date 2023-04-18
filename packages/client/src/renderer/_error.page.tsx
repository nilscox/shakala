import { Fallback } from '../elements/fallback';

export { ErrorPage as Page };

type ErrorPagePros = {
  is404: boolean;
};

const ErrorPage = ({ is404 }: ErrorPagePros) => {
  if (is404) {
    return <NotFound />;
  }

  return <UnexpectedError />;
};

const UnexpectedError = () => (
  <Fallback>
    <div className="mb-6 border-b-4 text-xxl">500</div>
    <div>Tout ne s'est pas passé come prévu...</div>
  </Fallback>
);

const NotFound = () => (
  <Fallback>
    <div className="mb-6 border-b-4 text-xxl">404</div>
    <div>Cette page n'existe pas</div>
  </Fallback>
);
