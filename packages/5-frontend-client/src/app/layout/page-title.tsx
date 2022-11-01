import Head from 'next/head';

type PageTitleProps = {
  children?: string;
};

export const PageTitle = ({ children }: PageTitleProps) => (
  <Head>
    <title>{getTitle(children)}</title>
  </Head>
);

const getTitle = (title?: string) => {
  if (!title) {
    return 'Shakala, échanges critiques';
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
