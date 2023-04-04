import { Link } from '@tiptap/extension-link';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Underline } from '@tiptap/extension-underline';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import clsx from 'clsx';

import '@fortawesome/fontawesome-free/css/fontawesome.css';
import '@fortawesome/fontawesome-free/css/solid.css';

// cspell:words tiptap fortawesome fontawesome classname

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
      disabled={!editor?.can().chain().focus().toggleBold().run()}
      onClick={() => editor?.chain().focus().toggleBold().run()}
    />

    <ToolbarItem
      icon="italic"
      active={editor?.isActive('italic')}
      disabled={!editor?.can().chain().focus().toggleItalic().run()}
      onClick={() => editor?.chain().focus().toggleItalic().run()}
    />

    <ToolbarItem
      icon="underline"
      active={editor?.isActive('underline')}
      disabled={!editor?.can().chain().focus().toggleUnderline().run()}
      onClick={() => editor?.chain().focus().toggleUnderline().run()}
    />

    <ToolbarItem
      icon="strikethrough"
      active={editor?.isActive('strike')}
      disabled={!editor?.can().chain().focus().toggleStrike().run()}
      onClick={() => editor?.chain().focus().toggleStrike().run()}
    />

    <ToolbarItem
      icon="link"
      active={editor?.isActive('list')}
      disabled={!editor?.can().chain().focus().toggleLink({ href: '' }).run()}
      onClick={() => editor?.chain().focus().toggleLink({ href: '' }).run()}
    />

    <ToolbarItem
      icon="list-ul"
      active={editor?.isActive('bulletList')}
      disabled={!editor?.can().chain().focus().toggleBulletList().run()}
      onClick={() => editor?.chain().focus().toggleBulletList().run()}
    />

    <ToolbarItem
      icon="list-ol"
      active={editor?.isActive('orderedList')}
      disabled={!editor?.can().chain().focus().toggleOrderedList().run()}
      onClick={() => editor?.chain().focus().toggleOrderedList().run()}
    />
  </div>
);

type ToolbarItemProps = {
  icon: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

const ToolbarItem = ({ icon, active, disabled, onClick }: ToolbarItemProps) => (
  <button
    type="button"
    disabled={disabled}
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
