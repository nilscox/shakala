import { clsx } from 'clsx';
import noScroll from 'no-scroll';
import { useEffect } from 'react';
import ReactModal from 'react-modal';

if (typeof window !== 'undefined') {
  ReactModal.setAppElement('#__next');
}

export const Modal = ({ className, isOpen, ...props }: ReactModal.Props) => {
  useEffect(() => {
    if (isOpen) {
      noScroll.on();

      return () => {
        setTimeout(() => {
          noScroll.off();
        }, 200);
      };
    }
  }, [isOpen]);

  return (
    <ReactModal
      isOpen={isOpen}
      overlayClassName="fixed top-0 bottom-0 left-0 right-0 bg-inverted/30 flex flex-col items-center justify-center p-2"
      className={clsx('card w-full rounded-lg border bg-neutral p-4 outline-none', className)}
      closeTimeoutMS={200}
      // https://github.com/reactjs/react-modal/issues/808
      onAfterClose={() => document.body.classList.remove('ReactModal__Body--open')}
      preventScroll
      {...props}
    />
  );
};
