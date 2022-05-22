import noScroll from 'no-scroll';
import { useEffect } from 'react';
import ReactModal from 'react-modal';

export const Modal = (props: ReactModal.Props) => {
  useEffect(() => {
    if (props.isOpen) {
      noScroll.on();

      return () => {
        setTimeout(() => {
          noScroll.off();
        }, 200);
      };
    }
  }, [props.isOpen]);

  return (
    <ReactModal
      overlayClassName="fixed top-0 bottom-0 left-0 right-0 bg-modal-overlay/30 flex flex-col items-center justify-center"
      className="p-4 m-2 bg-white rounded-lg border outline-none"
      closeTimeoutMS={200}
      preventScroll
      {...props}
    />
  );
};
