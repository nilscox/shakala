import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { TOKENS } from '~/app/tokens';
import { FieldError } from '~/elements/form-field';
import { useRichTextEditor } from '~/elements/rich-text-editor';
import { useRouteParam } from '~/hooks/use-route-params';
import { useSubmit } from '~/hooks/use-submit';
import { getQueryKey } from '~/utils/query-key';

export type CommentForm = {
  text: string;
};

type UseCommentFormProps = {
  autofocus?: boolean;
  placeholder?: string;
  initialHtml?: string;
  onCancel?: () => void;
  onSubmit: (text: string) => Promise<string>;
  onSubmitted?: (commentId: string) => void;
};

export const useCommentForm = ({
  autofocus,
  placeholder,
  initialHtml,
  onSubmit,
  onSubmitted,
}: UseCommentFormProps) => {
  const threadId = useRouteParam('threadId');

  const form = useForm<CommentForm>({
    defaultValues: {
      text: initialHtml,
    },
  });

  useEffect(() => {
    form.register('text');
    return () => form.unregister('text');
  }, [form]);

  const handleSubmit = useSubmit(form, async ({ text }) => onSubmit(text), {
    invalidate: getQueryKey(TOKENS.thread, 'getThreadComments', threadId),
    onSuccess: (commentId) => {
      form.setValue('text', '');
      form.clearErrors('text');

      editor?.chain().setContent('').run();

      onSubmitted?.(commentId);
    },
  });

  const editor = useRichTextEditor({
    autofocus,
    initialHtml,
    placeholder,
    onChange: (html) => {
      form.setValue('text', html);
      form.clearErrors('text');
    },
  });

  const loading = form.formState.isSubmitting;

  const errorCode = form.formState.errors.text?.message;
  const error = errorCode ? (
    <FieldError
      className="mr-auto"
      error={errorCode}
      errorsMap={{
        min: "Le message n'est pas suffisamment long",
        max: 'Le message est trop long (maximum : 20 000 caractères)',
      }}
    />
  ) : undefined;

  return {
    editor,
    loading,
    error,
    onSubmit: form.handleSubmit(handleSubmit) as React.FormEventHandler,
  };
};
