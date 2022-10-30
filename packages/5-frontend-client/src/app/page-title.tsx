import Head from 'next/head';
import { Fragment } from 'react';

type PageTitleProps = {
  children?: string;
};

// todo: remove when next/head is available with next 13
const Tag = (false as boolean) ? Head : Fragment;

export const PageTitle = ({ children }: PageTitleProps) => (
  <Tag>
    <title>{getTitle(children)}</title>
  </Tag>
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
