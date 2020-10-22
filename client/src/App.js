import React from 'react';
import './App.scss';
import { Provider } from 'react-redux';
import store from './store';
// import Home from './components/pages/Home';
import DisplayContent from './components/DisplayContent';
import DemoDisplayContent from './components/DemoDisplayContent';
import Login from './components/pages/Login';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Navbar from './components/Navbar';
function App() {
  return (
    <Provider store={store}>
      <>
        <Navbar/>
        <div className="home-content-wrapper">
        <Router>
          <Switch>
             <Route exact path="/login" component={Login}/>
             <Route exact path="/demo" component={DemoDisplayContent}/>
             <Route exact path="/" component={DisplayContent}/>
             <Redirect to="/" />
          </Switch>
        </Router>
        </div>
      </>
    </Provider>
  );
}

export default App;
