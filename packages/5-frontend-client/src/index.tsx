import * as ReactDOM from 'react-dom/client';
import ReactModal from 'react-modal';
import { BrowserRouter } from 'react-router-dom';

import { App } from './app';
import { SnackbarProvider } from './components/elements/snackbar';
import { AnalyticsProvider } from './utils/analytics-provider';
import { ErrorBoundary } from './utils/error-boundary';
import { ScrollToTop } from './utils/scroll-to-top';

const app = document.getElementById('app') as HTMLElement;

ReactModal.setAppElement(app);

ReactDOM.createRoot(app).render(
  <ErrorBoundary>
    <BrowserRouter>
      <AnalyticsProvider>
        <ScrollToTop />
        <SnackbarProvider>
          <App />
        </SnackbarProvider>
      </AnalyticsProvider>
    </BrowserRouter>
  </ErrorBoundary>,
);
