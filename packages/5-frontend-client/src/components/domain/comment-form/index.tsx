import { RealCommentForm } from './comment-form';
import { FakeForm } from './fake-form';

export enum FormType {
  fake = 'fake',
  real = 'real',
}

type CommentFormPros = {
  parentId: string;
  form: FormType;
  setForm: (form: FormType) => void;
};

export const CommentForm = ({ parentId, form, setForm }: CommentFormPros) => {
  if (form === FormType.fake) {
    return <FakeForm onFocus={() => setForm(FormType.real)} />;
  }

  const resetForm = () => {
    setForm(FormType.fake);
  };

  return <RealCommentForm parentId={parentId} onCancel={resetForm} onSubmitted={resetForm} />;
};
