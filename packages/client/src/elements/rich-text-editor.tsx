import { Link } from '@tiptap/extension-link';
import { Placeholder } from '@tiptap/extension-placeholder';
import Superscript from '@tiptap/extension-superscript';
import Typography from '@tiptap/extension-typography';
import { Underline } from '@tiptap/extension-underline';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import clsx from 'clsx';

import '@fortawesome/fontawesome-free/css/fontawesome.css';
import '@fortawesome/fontawesome-free/css/solid.css';

// cspell:words tiptap fortawesome fontawesome classname

const CustomSuperscript = Superscript.extend({
  group: 'inline',
  content: 'text+',
  inline: true,
  exitable: true,
});

type UseRichTextEditorProps = {
  autofocus?: boolean;
  initialHtml?: string;
  placeholder?: string;
  onChange?: (html: string) => void;
};

export const useRichTextEditor = ({
  autofocus,
  initialHtml,
  placeholder,
  onChange,
}: UseRichTextEditorProps = {}) => {
  return useEditor({
    content: initialHtml,
    editorProps: {
      attributes: {
        class: 'outline-none prose max-w-none flex-1',
      },
    },
    autofocus,
    extensions: [
      StarterKit,
      Underline,
      CustomSuperscript,
      Typography.configure({ superscriptTwo: false, superscriptThree: false }),
      Placeholder.configure({ placeholder }),
      Link.configure({ openOnClick: false }),
    ],
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
  });
};

type RichTextEditorProps = {
  editor: Editor | null;
  className?: string;
};

export const RichTextEditor = ({ editor, className }: RichTextEditorProps) => {
  return <EditorContent editor={editor} className={clsx(className, 'col')} />;
};

type EditorToolbarProps = {
  editor: Editor | null;
  className?: string;
};

export const EditorToolbar = ({ editor, className }: EditorToolbarProps) => (
  <div className={clsx('row items-center gap-1', className)}>
    <ToolbarItem
      icon="bold"
      active={editor?.isActive('bold')}
      onClick={() => editor?.chain().focus().toggleBold().run()}
    />

    <ToolbarItem
      icon="italic"
      active={editor?.isActive('italic')}
      onClick={() => editor?.chain().focus().toggleItalic().run()}
    />

    <ToolbarItem
      icon="underline"
      active={editor?.isActive('underline')}
      onClick={() => editor?.chain().focus().toggleUnderline().run()}
    />

    <ToolbarItem
      icon="strikethrough"
      active={editor?.isActive('strike')}
      onClick={() => editor?.chain().focus().toggleStrike().run()}
    />

    <ToolbarItem
      icon="link"
      active={editor?.isActive('list')}
      onClick={() => {
        const href = window.prompt('Cible du lien', editor?.getAttributes('link').href);

        if (href) {
          editor?.chain().focus().toggleLink({ href }).run();
        }
      }}
    />

    <ToolbarItem
      icon="list-ul"
      active={editor?.isActive('bulletList')}
      onClick={() => editor?.chain().focus().toggleBulletList().run()}
    />

    <ToolbarItem
      icon="list-ol"
      active={editor?.isActive('orderedList')}
      onClick={() => editor?.chain().focus().toggleOrderedList().run()}
    />

    <ToolbarItem
      icon="superscript"
      active={editor?.isActive('superscript')}
      onClick={() => editor?.chain().focus().toggleSuperscript().run()}
    />
  </div>
);

type ToolbarItemProps = {
  icon: string;
  active?: boolean;
  onClick: () => void;
};

const ToolbarItem = ({ icon, active, onClick }: ToolbarItemProps) => (
  <button
    type="button"
    className={clsx(
      'col h-5 w-5 items-center justify-center rounded-xs text-muted hover:bg-inverted/5',
      active && '!text-primary'
    )}
    onClick={onClick}
  >
    {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
    <i className={`fa-solid fa-${icon}`} />
  </button>
);
