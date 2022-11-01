import { FormErrors, FormField as FormFieldType, ThreadForm as ThreadFormType } from 'frontend-domain';
import { FormEventHandler, useState } from 'react';

import { Button } from '~/components/elements/button';
import { FormField } from '~/components/elements/form-field';
import { Input } from '~/components/elements/input';
import { MarkdownPreviewInput } from '~/components/elements/markdown-preview-input/markdown-preview-input';

type CreateThreadFormProps = {
  errors: FormErrors<ThreadFormType>;
  onChange: (field: FormFieldType<ThreadFormType>) => void;
  onSubmit: (values: ThreadFormType) => void;
};

export const ThreadForm = ({ errors, onChange, onSubmit }: CreateThreadFormProps) => {
  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const description = data.get('description') as string;
    const keywords = data.get('keywords') as string;
    const text = data.get('text') as string;

    onSubmit({
      description: description.trim(),
      keywords: keywords
        .trim()
        .split(' ')
        .filter((word) => word.length > 0),
      text: text.trim(),
    });
  };

  const createFieldChangeHandler = (field: FormFieldType<ThreadFormType>) => () => {
    onChange(field);
  };

  const [message, setMessage] = useState('');

  return (
    <form className="col gap-2" onSubmit={handleSubmit}>
      <FormField
        name="description"
        label="Description"
        description="bref résumé du sujet que vous allez aborder"
        error={errors.description}
        errorsMap={{
          min: 'La description est trop courte',
          max: 'La description est trop longue',
        }}
      >
        <Input required className="w-full" onChange={createFieldChangeHandler('description')} />
      </FormField>

      <FormField
        name="keywords"
        label="Mots-clés"
        description="liste de mots en lien avec le sujet de cette discussion"
        error={errors.keywords}
        errorsMap={{
          min: 'Un des mots-clés est trop court',
          max: 'Un des mots-clés est trop long',
        }}
      >
        <Input className="w-full" onChange={createFieldChangeHandler('keywords')} />
      </FormField>

      <FormField
        name="text"
        label="Texte"
        error={errors.text}
        errorsMap={{
          min: 'Le texte est trop court',
          max: 'Le texte est trop long',
        }}
      >
        <MarkdownPreviewInput border rows={8} value={message} onChange={setMessage} />
      </FormField>

      <Button primary type="submit" className="self-end">
        Créer
      </Button>
    </form>
  );
};
