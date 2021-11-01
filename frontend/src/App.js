import './App.css';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'

import UserPage from './pages/User'
import EventsPage from './pages/Events'
import BookingsPage from './pages/Bookings'

function App() {
  return (

    <div className="App">
      <BrowserRouter>
        <Switch>
          <Redirect from="/" to="/user" exact />
          <Route path="/user" component={UserPage} />
          <Route path="/events" component={EventsPage} />
          <Route path="/bookings" component={BookingsPage} />
        </Switch>
      </BrowserRouter>

    </div>
  );
}

export default App;
