import './App.css';
import client from './lib/client';
import { ApolloProvider } from '@apollo/client';
import { Layout } from './container/Layout';
import { BrowserRouter as Router } from 'react-router-dom';
import { StateProvider } from './provider/StateProvider';
import { ThemeProvider } from './provider/ThemeProvider';
import { AuthProvider } from '@state-less/react-client';

function App() {
  return (
    <div className="App">
      <ApolloProvider client={client}>
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
