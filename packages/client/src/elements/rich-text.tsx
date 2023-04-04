import clsx from 'clsx';

type RichTextProps = {
  className?: string;
  children: string;
};

export const RichText = ({ className, children }: RichTextProps) => (
  <div className={clsx('prose max-w-none', className)} dangerouslySetInnerHTML={{ __html: children }} />
);
