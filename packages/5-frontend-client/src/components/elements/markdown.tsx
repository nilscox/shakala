import { clsx } from 'clsx';
import { useEffect, useState } from 'react';

import { markdownToHtml } from '~/utils/markdown-to-html';

type MarkdownProps = {
  className?: string;
  highlight?: string;
  markdown: string;
};

export const Markdown = ({ className, highlight, markdown }: MarkdownProps): JSX.Element => {
  const [html, setHtml] = useState('');

  useEffect(() => {
    const renderHtml = async () => {
      setHtml(await markdownToHtml(markdown, highlight));
    };

    void renderHtml();
  }, [markdown, highlight]);

  return <div className={clsx('max-w-none prose', className)} dangerouslySetInnerHTML={{ __html: html }} />;
};
