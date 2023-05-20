import { action } from '@storybook/addon-actions';
import { Meta, StoryFn } from '@storybook/react';
import { useInjection } from 'brandi-react';

import { TOKENS } from '~/app/tokens';
import { maxWidthDecorator } from '~/utils/storybook';

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
  const { useEditor, Editor, Toolbar } = useInjection(TOKENS.richTextEditor);

  const editor = useEditor({
    onChange: action('onChange'),
    ...args,
  });

  return (
    <>
      <Editor editor={editor} className="min-h-1 rounded border bg-neutral p-1" />
      <Toolbar editor={editor} className="mt-1" />
    </>
  );
};
