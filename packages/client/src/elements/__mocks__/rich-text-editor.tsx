import { useState } from 'react';

export const useRichTextEditor = (props: Record<string, unknown>) => {
  const [value, setValue] = useState(props.initialHtml);

  return {
    ...props,
    value,
    chain: () => ({
      setContent: (content: string) => ({
        run: () => setValue(content),
      }),
    }),
  };
};

export const EditorToolbar = () => null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RichTextEditor = ({ editor }: any) => (
  <textarea
    placeholder={editor.placeholder}
    value={editor.value}
    onChange={(e) => editor.onChange(e.target.value)}
    data-testid="mock-rich-text-editor"
  />
);
