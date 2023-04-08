import { Meta } from '@storybook/react';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import clsx from 'clsx';
import { createContext, useContext } from 'react';

import { maxWidthDecorator } from '~/utils/storybook';

export default {
  title: 'Elements/Test',
  decorators: [maxWidthDecorator],
} satisfies Meta;

const editorContext = createContext<Editor | null>(null);

export const App = () => (
  <EditorProvider>
    <Bold />
    <Content />
  </EditorProvider>
);

export const App2 = () => (
  <EditorProvider2 value={useRichTextEditor()}>
    <Bold />
    <Content />
  </EditorProvider2>
);

const EditorProvider = ({ children }: { children: React.ReactNode }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Hello World!</p>',
  });

  return <editorContext.Provider value={editor}>{children}</editorContext.Provider>;
};

const useRichTextEditor = () => {
  return useEditor({
    extensions: [StarterKit],
    content: '<p>Hello World!</p>',
  });
};

const EditorProvider2 = editorContext.Provider;

export const Bold = () => {
  const editor = useContext(editorContext);

  return (
    <button
      style={{ color: clsx(editor?.isActive('bold') ? 'green' : 'black') }}
      onClick={() => editor?.chain().focus().toggleBold().run()}
    >
      bold
    </button>
  );
};

const Content = () => {
  const editor = useContext(editorContext);

  return <EditorContent editor={editor} />;
};
