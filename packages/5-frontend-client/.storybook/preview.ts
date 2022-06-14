import ReactModal from 'react-modal';

import '@fontsource/montserrat/latin.css';
import '@fontsource/open-sans/latin.css';

import '../src/styles/tailwind.css';
import '../src/styles/react-modal.css';

ReactModal.setAppElement('#root');

export const parameters = {
  options: {
    storySort: {
      order: ['Theme', 'Elements', 'Domain'],
    },
  },
};
