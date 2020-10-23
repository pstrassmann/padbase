import React from 'react';
import './App.scss';
import { Provider } from 'react-redux';
import store from './store';
import HomeWrapper from './components/HomeWrapper';
import DemoHomeWrapper from './components/DemoHomeWrapper';
import Login from './components/pages/Login';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Navbar from './components/Navbar';
function App() {
  return (
    <Provider store={store}>
      <>
        <Router>
        <Navbar/>
        <div className="home-content-wrapper">
          <Switch>
             <Route exact path="/login" component={Login}/>
             <Route exact path="/demo" component={DemoHomeWrapper}/>
             <Route exact path="/" component={HomeWrapper}/>
             <Redirect to="/" />
          </Switch>
        </div>
        </Router>
      </>
    </Provider>
  );
}

export default App;
