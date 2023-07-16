import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import client from "./lib/client";
import { ApolloProvider } from '@apollo/client';
import { List } from './server-components/Todos';
import { Layout } from './container/Layout';
import { BrowserRouter as Router } from 'react-router-dom';
import { StateProvider } from './provider/StateProvider';
import { ThemeProvider } from './provider/ThemeProvider';
import { AuthProvider } from '@state-less/react-client';

function App() {
  const [count, setCount] = useState(0)

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
  )
}

export default App
