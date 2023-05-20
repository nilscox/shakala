import { useState } from 'react';

import { RichTextEditor } from './rich-text-editor.port';

type StubRichTextEditor = RichTextEditor<React.HTMLProps<HTMLTextAreaElement>>;

const useEditor: StubRichTextEditor['useEditor'] = ({ autofocus, initialHtml, placeholder, onChange }) => {
  const [value, setValue] = useState(initialHtml ?? '');

  const props: React.HTMLProps<HTMLTextAreaElement> = {
    autoFocus: autofocus,
    placeholder,
    value,
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = event.target.value;

      setValue(value);
      onChange?.(value);
    },
  };

  return {
    editor: props,
    clear: () => setValue(''),
  };
};

const Editor: StubRichTextEditor['Editor'] = ({ editor, ...props }) => {
  return <textarea {...editor} {...props} />;
};

const Toolbar: StubRichTextEditor['Toolbar'] = () => {
  return null;
};

export const stubRichTextEditor: StubRichTextEditor = {
  useEditor,
  Editor,
  Toolbar,
};
