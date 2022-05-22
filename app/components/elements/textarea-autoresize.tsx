import { ComponentProps } from 'react';

type TextAreaAutoResizeProps = ComponentProps<'textarea'>;

export const TextAreaAutoResize = (props: TextAreaAutoResizeProps) => {
  return <textarea ref={resize} {...props} />;
};

const resize = (textarea: HTMLTextAreaElement | null) => {
  if (textarea) {
    textarea.style.height = textarea.scrollHeight + 'px';
  }
};
