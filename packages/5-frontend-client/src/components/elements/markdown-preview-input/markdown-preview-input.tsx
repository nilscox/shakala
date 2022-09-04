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
          'block w-full border-y p-1 focus-visible:outline-none',
          border && 'rounded border',
          tab !== Tab.edit && 'hidden',
        )}
        {...props}
      />

      <Markdown
        markdown={value}
        className={clsx(
          'min-h-markdown-preview border-y bg-neutral p-1',
          border && 'rounded border',
          tab !== Tab.preview && 'hidden',
        )}
      />
    </>
  );
};
