
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'

import UserPage from './pages/User'
import EventsPage from './pages/Events'
import BookingsPage from './pages/Bookings'
import MainNavigation from './components/Navigation/MainNavigation';

//Apollo GraphQL setup
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from
} from '@apollo/client';
import { onError } from '@apollo/client/link/error'
const dotenv = require('dotenv');
dotenv.config();
const API_PORT = process.env.API_PORT || 8000
const errorLink = onError(({ graphqlErrors, networkError }) => {
  if (graphqlErrors) {
    graphqlErrors.map(({ message, location, path }) => {
      alert(`Graphql error ${message}`);
    });
  }
});

const link = from([
  errorLink,
  new HttpLink({ uri: `http://localhost:${API_PORT}/graphql` }),
]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link,
});



function App() {
  return (
    <div className="App">
      <ApolloProvider client={client}>

        <BrowserRouter>
          <>
            <MainNavigation />

            <main>
              <Switch>
                <Redirect from="/" to="/user" exact />
                <Route path="/user" component={UserPage} />
                <Route path="/events" component={EventsPage} />
                <Route path="/bookings" component={BookingsPage} />
              </Switch>
            </main>
          </>
        </BrowserRouter>
      </ApolloProvider>

    </div>
  );
}

export default App;
