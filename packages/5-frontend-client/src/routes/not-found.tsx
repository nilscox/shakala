import notFoundImage from '~/images/404.png';

export const NotFoundRoute = () => (
  <>
    <h1 className="my-6 text-xl font-bold text-center">Cette page n'existe pas</h1>

    <img
      src={notFoundImage}
      alt="not found"
      // eslint-disable-next-line tailwindcss/no-arbitrary-value
      className="m-auto my-6 max-w-[16rem] bg-neutral rounded-lg border"
    />
  </>
);
