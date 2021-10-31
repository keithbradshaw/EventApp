import './App.css';
import { BrowserRouter, Route } from 'react-router-dom'
function App() {
  return (

    <div className="App">
      <BrowserRouter>
      <Route path="/" component={null} />
      <Route path="/user" component={null} />
      <Route path="/events" component={null} />
      <Route path="/bookings" component={null} />

      </BrowserRouter>

    </div>
  );
}

export default App;
