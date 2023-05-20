import { Link } from '@tiptap/extension-link';
import { Placeholder } from '@tiptap/extension-placeholder';
import Superscript from '@tiptap/extension-superscript';
import Typography from '@tiptap/extension-typography';
import { Underline } from '@tiptap/extension-underline';
import { EditorContent, Editor as TipTapEditor, useEditor as useTipTapEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { clsx } from 'clsx';

import { RichTextEditor } from './rich-text-editor.port';

import '@fortawesome/fontawesome-free/css/fontawesome.css';
import '@fortawesome/fontawesome-free/css/solid.css';

type TipTapRichTextEditor = RichTextEditor<TipTapEditor | null>;

// cspell:words fortawesome fontawesome classname exitable

const CustomSuperscript = Superscript.extend({
  group: 'inline',
  content: 'text+',
  inline: true,
  exitable: true,
});

const useEditor: TipTapRichTextEditor['useEditor'] = ({ autofocus, initialHtml, placeholder, onChange }) => {
  const editor = useTipTapEditor({
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

  return {
    editor,
    clear: () => editor?.chain().setContent('').run(),
  };
};

const Editor: TipTapRichTextEditor['Editor'] = ({ editor, className, ...props }) => {
  return <EditorContent editor={editor} className={clsx(className, 'col')} {...props} />;
};

const Toolbar: TipTapRichTextEditor['Toolbar'] = ({ editor, className }) => (
  <div className={clsx('row items-center gap-1', className)}>
    <ToolbarItem
      icon="bold"
      active={editor?.isActive('bold')}
      title="Gras"
      onClick={() => editor?.chain().focus().toggleBold().run()}
      />

    <ToolbarItem
      icon="italic"
      active={editor?.isActive('italic')}
      title="Italique"
      onClick={() => editor?.chain().focus().toggleItalic().run()}
      />

    <ToolbarItem
      icon="underline"
      active={editor?.isActive('underline')}
      title="Souligner"
      onClick={() => editor?.chain().focus().toggleUnderline().run()}
      />

    <ToolbarItem
      icon="strikethrough"
      active={editor?.isActive('strike')}
      title="Barrer"
      onClick={() => editor?.chain().focus().toggleStrike().run()}
      />

    <ToolbarItem
      icon="link"
      active={editor?.isActive('list')}
      title="Lien"
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
      title="List à point"
      onClick={() => editor?.chain().focus().toggleBulletList().run()}
      />

    <ToolbarItem
      icon="list-ol"
      active={editor?.isActive('orderedList')}
      title="List ordonnée"
      onClick={() => editor?.chain().focus().toggleOrderedList().run()}
      />

    <ToolbarItem
      icon="superscript"
      active={editor?.isActive('superscript')}
      title="Indice de confiance"
      onClick={() => editor?.chain().focus().toggleSuperscript().run()}
    />
  </div>
);

type ToolbarItemProps = {
  icon: string;
  active?: boolean;
  title?: string;
  onClick: () => void;
};

const ToolbarItem = ({ icon, active, title, onClick }: ToolbarItemProps) => (
  <button
    type="button"
    className={clsx(
      'col h-5 w-5 items-center justify-center rounded-xs text-muted hover:bg-inverted/5',
      active && '!text-primary'
    )}
    onClick={onClick}
    title={title}
  >
    {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
    <i className={`fa-solid fa-${icon}`} />
  </button>
);

export const tiptapRichTextEditor: TipTapRichTextEditor = {
  useEditor,
  Editor,
  Toolbar,
};
