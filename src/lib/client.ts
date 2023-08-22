import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { LOCAL_HOST } from '../config';

// Create an HTTP link
const statelessHttp = new HttpLink({
  uri: 'https://graphql.state-less.cloud/graphql',
});

// Create a WebSocket link
const statelessWs = new WebSocketLink({
  uri: `wss://graphql.state-less.cloud/graphql`,
  options: {
    reconnect: true,
  },
});

// Use the split function to direct traffic between the two links
const stateless = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  statelessWs,
  statelessHttp
);

// Create the Apollo Client instance
const client = new ApolloClient({
  link: stateless,
  cache: new InMemoryCache(),
});

// Create an HTTP link
const localHttp = new HttpLink({
  uri: `http://${LOCAL_HOST}:4000/graphql`,
});

// Create a WebSocket link
const localWs = new WebSocketLink({
  uri: `ws://${LOCAL_HOST}:4000/graphql`,
  options: {
    reconnect: true,
  },
});

// Use the split function to direct traffic between the two links
const local = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  localWs,
  localHttp
);

// Create the Apollo Client instance
export const localClient = new ApolloClient({
  link: local,
  cache: new InMemoryCache(),
});

export default client;
