import classNames from 'classnames';
import { micromark } from 'micromark';

type MarkdownProps = {
  className?: string;
  markdown: string;
};

export const Markdown = ({ className, markdown }: MarkdownProps): JSX.Element => (
  <div
    className={classNames('max-w-none prose', className)}
    dangerouslySetInnerHTML={{ __html: micromark(markdown) }}
  />
);
