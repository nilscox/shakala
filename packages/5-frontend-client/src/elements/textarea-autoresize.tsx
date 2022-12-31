import { forwardRef } from 'react';

import { useMergeRefs } from '~/hooks/use-merge-refs';

type TextAreaAutoResizeProps = React.ComponentPropsWithoutRef<'textarea'>;

export const TextAreaAutoResize = forwardRef<HTMLTextAreaElement, TextAreaAutoResizeProps>((props, ref) => {
  return <textarea ref={useMergeRefs(ref, resize)} {...props} />;
});

TextAreaAutoResize.displayName = 'TextAreaAutoResize';

const resize = (textarea: HTMLTextAreaElement | null) => {
  if (textarea) {
    // +2 is for the borders (I think...)
    textarea.style.height = String(textarea.scrollHeight + 2) + 'px';
  }
};
