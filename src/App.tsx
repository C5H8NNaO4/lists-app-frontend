import './App.css';
import client, { localClient } from './lib/client';
import { ApolloProvider } from '@apollo/client';
import { Layout } from './container/Layout';
import { BrowserRouter as Router } from 'react-router-dom';
import { StateProvider } from './provider/StateProvider';
import { ThemeProvider } from './provider/ThemeProvider';
import { AuthProvider, useLocalStorage } from '@state-less/react-client';
import { Helmet } from 'react-helmet';

function App() {
  const [cookieConsent] = useLocalStorage('cookie-consent', null);

  return (
    <div className="App">
      {cookieConsent === true && (
        <Helmet>
          <script src="https://www.googletagmanager.com/gtag/js?id=G-C3F4656WLD"></script>

          <script id="gtm-script" src="/gtag-1.js"></script>
          <script
            id="test"
            type="application/javascript"
            src="/gtag-2.js"
          ></script>
        </Helmet>
      )}
      <ApolloProvider
        client={import.meta.env.MODE === 'production' ? client : localClient}
      >
        <AuthProvider>
          <StateProvider>
            <Router>
              <ThemeProvider>
                <Layout />
              </ThemeProvider>
            </Router>
          </StateProvider>
        </AuthProvider>
      </ApolloProvider>
    </div>
  );
}

export default App;
