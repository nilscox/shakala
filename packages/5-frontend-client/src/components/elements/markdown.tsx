import { clsx } from 'clsx';

import { markdownToHtml } from '~/utils/markdown-to-html';

type MarkdownProps = {
  className?: string;
  highlight?: string;
  markdown: string;
};

export const Markdown = ({ className, highlight, markdown }: MarkdownProps): JSX.Element => (
  <div
    className={clsx('max-w-none prose', className)}
    dangerouslySetInnerHTML={{ __html: markdownToHtml(markdown, highlight) }}
  />
);
