import React from 'react';
import ReactDOM from 'react-dom/client'; // Import createRoot from react-dom/client
import { Provider } from 'react-redux';

import { QueryClient, QueryClientProvider } from 'react-query';
import { HashRouter } from 'react-router-dom';
import App from './App';
import store from './Redux/store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
      <HashRouter>
          <App />
        </HashRouter>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
