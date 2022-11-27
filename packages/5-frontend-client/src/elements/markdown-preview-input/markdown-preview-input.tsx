import { clsx } from 'clsx';
import { forwardRef, useState } from 'react';

import { Markdown } from '../markdown';
import { TextAreaAutoResize } from '../textarea-autoresize';

import { MarkdownPreviewTabs, Tab } from './markdown-preview-tabs';

type MarkdownPreviewInputProps = Omit<React.ComponentPropsWithoutRef<'textarea'>, 'value'> & {
  border?: boolean;
  value?: string;
};

export const MarkdownPreviewInput = forwardRef<HTMLTextAreaElement, MarkdownPreviewInputProps>(
  ({ border, value, ...props }, ref) => {
    const [tab, setTab] = useState(Tab.edit);

    return (
      <>
        <MarkdownPreviewTabs tab={tab} setTab={setTab} />

        <TextAreaAutoResize
          ref={ref}
          value={value}
          className={clsx(
            'block w-full border-y p-1 focus-visible:outline-none',
            border && 'rounded border',
            tab !== Tab.edit && 'hidden',
          )}
          {...props}
        />

        <Markdown
          markdown={value ?? ''}
          className={clsx(
            'min-h-1 border-y bg-neutral p-1',
            border && 'rounded border',
            tab !== Tab.preview && 'hidden',
          )}
        />
      </>
    );
  },
);

MarkdownPreviewInput.displayName = 'MarkdownPreviewInput';
