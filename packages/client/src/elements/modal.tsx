import { clsx } from 'clsx';
import noScroll from 'no-scroll';
import { useEffect } from 'react';
import ReactModal from 'react-modal';

const animationDuration = 200;

if (typeof window !== 'undefined') {
  ReactModal.setAppElement(document.getElementById('__next') ?? document.body);
}

export const Modal = ({ className, isOpen, onRequestClose, ...props }: ReactModal.Props) => {
  useEffect(() => {
    if (isOpen) {
      noScroll.on();

      return () => {
        setTimeout(() => {
          noScroll.off();
        }, animationDuration);
      };
    }
  }, [isOpen]);

  return (
    <ReactModal
      isOpen={isOpen}
      overlayClassName="fixed top-0 bottom-0 left-0 right-0 bg-inverted/30 flex flex-col items-center justify-center p-2"
      className={clsx('card w-full rounded-lg border bg-neutral p-4 outline-none', className)}
      closeTimeoutMS={200}
      onRequestClose={(event) => {
        onRequestClose?.(event);
        // https://github.com/reactjs/react-modal/issues/808
        document.body.classList.remove('ReactModal__Body--open');
      }}
      preventScroll
      {...props}
    />
  );
};
