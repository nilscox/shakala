import { RealCommentForm } from './comment-form';
import { FakeForm } from './fake-form';

export enum FormType {
  fake = 'fake',
  real = 'real',
}

type CommentFormPros = {
  form: FormType;
  setForm: (form: FormType) => void;
};

export const CommentForm = ({ form, setForm }: CommentFormPros) => {
  if (form === FormType.fake) {
    return <FakeForm onFocus={() => setForm(FormType.real)} />;
  }

  return <RealCommentForm onCancel={() => setForm(FormType.fake)} />;
};
