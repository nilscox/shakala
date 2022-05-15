import ReactModal from 'react-modal';

export const Modal = (props: ReactModal.Props) => (
  <ReactModal
    className="absolute top-1/2 left-1/2 p-4 bg-white rounded-lg border border-light-gray outline-none -translate-x-1/2  -translate-y-1/2"
    overlayClassName="fixed top-0 bottom-0 left-0 right-0 bg-[#000000]/20"
    closeTimeoutMS={200}
    {...props}
  />
);
