type RichTextEditorProps = {
  autofocus?: boolean;
  initialHtml?: string;
  placeholder?: string;
  onChange?: (html: string) => void;
};

type RichTextEditorAPI<Editor> = {
  editor: Editor;
  clear: () => void;
};

export interface RichTextEditor<Editor = unknown> {
  useEditor(props: RichTextEditorProps): RichTextEditorAPI<Editor>;
  Editor: React.ComponentType<{ editor: Editor; className?: string }>;
  Toolbar: React.ComponentType<{ editor: Editor; className?: string }>;
}
