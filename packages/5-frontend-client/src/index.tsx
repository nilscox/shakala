import * as ReactDOM from 'react-dom/client';
import ReactModal from 'react-modal';
import { BrowserRouter } from 'react-router-dom';

import { App } from './app';
import { SnackbarProvider } from './components/elements/snackbar';
import { ErrorBoundary } from './utils/error-boundary';

const app = document.getElementById('app') as HTMLElement;

ReactModal.setAppElement(app);

ReactDOM.createRoot(app).render(
  <ErrorBoundary>
    <BrowserRouter>
      <SnackbarProvider>
        <App />
      </SnackbarProvider>
    </BrowserRouter>
  </ErrorBoundary>,
);
