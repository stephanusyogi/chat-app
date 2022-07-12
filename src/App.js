import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@material-ui/core";
import { RecoilRoot } from "recoil";
import Main from "./pages/Main";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { setContext } from "@apollo/client/link/context";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  split,
  HttpLink,
  ApolloLink,
} from "@apollo/client";

function App() {
  const { loginWithRedirect, getIdTokenClaims, isLoading, isAuthenticated } =
    useAuth0();
  const [token, setToken] = useState("");

  if (isLoading) {
    return (
      <div style={{ textAlign: "center" }}>
        <h1>Data Loading...</h1>
      </div>
    );
  }

  getIdTokenClaims().then((resp) => {
    console.log(resp);
    if (resp) {
      setToken(resp.__raw);
    }
  });

  const wsLink = new WebSocketLink({
    uri: process.env.REACT_APP_GRAPHQL_WEBSOCKET,
    options: {
      reconnect: true,
      connectionParams: {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      },
    },
  });
  const httpLink = new HttpLink({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  });
  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local cookie if it exists
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpLink
  );

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([authLink, splitLink]),
  });

  return (
    <ApolloProvider client={client}>
      {isAuthenticated ? (
        <RecoilRoot>
          <Main></Main>
        </RecoilRoot>
      ) : (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <Button
              variant="contained"
              color="primary"
              className="App-link"
              onClick={() => loginWithRedirect()}
            >
              LOGIN
            </Button>
          </header>
        </div>
      )}
    </ApolloProvider>
  );
}

export default App;
