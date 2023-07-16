import { ApolloClient, InMemoryCache, split, HttpLink } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

// Create an HTTP link
const localHttp = new HttpLink({
  uri: "http://localhost:4000/graphql",
});

// Create a WebSocket link
const localWs = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
  },
});

// Use the split function to direct traffic between the two links
const local = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
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

export default localClient;