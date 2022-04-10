import { micromark } from 'micromark';

type MarkdownProps = {
  markdown: string;
};

export const Markdown = ({ markdown }: MarkdownProps): JSX.Element => {
  return <div className="max-w-none prose" dangerouslySetInnerHTML={{ __html: micromark(markdown) }} />;
};
