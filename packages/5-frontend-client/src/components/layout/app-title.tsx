import { Helmet } from 'react-helmet';

type PageTitleProps = {
  children?: string;
};

export const AppTitle = ({ children }: PageTitleProps) => (
  <Helmet>
    <title>{getTitle(children)}</title>
  </Helmet>
);

const getTitle = (title?: string) => {
  if (!title) {
    return 'Shakala, échanges critiques et bienveillants';
  }

  if (title.length > 60) {
    return (
      title
        .slice(0, 60)
        .replace(/\n+/g, ' ')
        .replace(/[a-zA-Z0-9]*$/, '')
        .replace(/ +$/, '') + '… | Shakala'
    );
  }

  return title + ' | Shakala';
};
