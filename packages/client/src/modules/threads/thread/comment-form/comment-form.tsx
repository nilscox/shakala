import { useInjection } from 'brandi-react';
import { useForm } from 'react-hook-form';

import { TOKENS } from '~/app/tokens';
import { FieldError } from '~/elements/form-field';
import { useSnackbar } from '~/elements/snackbar';
import { useInvalidateQuery } from '~/hooks/use-query';
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
  autofocus = false,
  placeholder,
  initialHtml,
  onSubmit,
  onSubmitted,
}: UseCommentFormProps) => {
  const threadId = useRouteParam('threadId');
  const snackbar = useSnackbar();

  const form = useForm<CommentForm>({
    defaultValues: {
      text: initialHtml,
    },
  });

  const invalidate = useInvalidateQuery();

  const handleSubmit = useSubmit(form, async ({ text }) => onSubmit(text), {
    async onSuccess(commentId) {
      await invalidate(getQueryKey(TOKENS.thread, 'getThreadComments', threadId));

      form.setValue('text', '');
      form.clearErrors('text');

      clear();

      onSubmitted?.(commentId);
    },
    onError(error) {
      if (error.message === 'UserMustBeAuthorError') {
        snackbar.error("Vous devez être l'auteur du message pour pouvoir l'éditer.");
      } else {
        throw error;
      }
    },
  });

  const { editor, clear } = useInjection(TOKENS.richTextEditor).useEditor({
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
