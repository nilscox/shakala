import { action } from '@storybook/addon-actions';
import { Meta, StoryFn } from '@storybook/react';

import { maxWidthDecorator } from '~/utils/storybook';

import { EditorToolbar, RichTextEditor, useRichTextEditor } from '../rich-text-editor';

type Args = {
  autofocus: boolean;
  initialHtml?: string;
  placeholder?: string;
};

export default {
  title: 'Elements/RichTextEditor',
  decorators: [maxWidthDecorator],
  args: {
    autofocus: true,
    initialHtml: '',
    placeholder: 'Type anything you want',
  },
} satisfies Meta<Args>;

export const richTextEditor: StoryFn<Args> = (args) => {
  const editor = useRichTextEditor({
    onChange: action('onChange'),
    ...args,
  });

  return (
    <>
      <RichTextEditor editor={editor} className="min-h-1 rounded border bg-neutral p-1" />
      <EditorToolbar editor={editor} className="mt-1" />
    </>
  );
};
