import classNames from 'classnames';
import noScroll from 'no-scroll';
import { useEffect } from 'react';
import ReactModal from 'react-modal';

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
      overlayClassName="fixed top-0 bottom-0 left-0 right-0 bg-modal-overlay/30 flex flex-col items-center justify-center p-2"
      className={classNames('p-4 w-full bg-white rounded-lg border outline-none', className)}
      closeTimeoutMS={200}
      preventScroll
      {...props}
    />
  );
};
