import { clsx } from 'clsx';
import { ComponentProps, useState } from 'react';

import { Markdown } from '../markdown';
import { TextAreaAutoResize } from '../textarea-autoresize';

import { MarkdownPreviewTabs, Tab } from './markdown-preview-tabs';

type MarkdownPreviewInputProps = Omit<ComponentProps<'textarea'>, 'value' | 'onChange'> & {
  border?: boolean;
  value: string;
  onChange: (value: string) => void;
};

export const MarkdownPreviewInput = ({ border, value, onChange, ...props }: MarkdownPreviewInputProps) => {
  const [tab, setTab] = useState(Tab.edit);

  return (
    <>
      <MarkdownPreviewTabs tab={tab} setTab={setTab} />

      <TextAreaAutoResize
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={clsx(
          'block p-1 w-full border-y focus-visible:outline-none',
          border && 'rounded border',
          tab !== Tab.edit && 'hidden',
        )}
        {...props}
      />

      <Markdown
        markdown={value}
        className={clsx(
          'p-1 min-h-markdown-preview bg-neutral border-y',
          border && 'rounded border',
          tab !== Tab.preview && 'hidden',
        )}
      />
    </>
  );
};
