import React from 'react';
import './App.scss';
import { Provider } from 'react-redux';
import store from './store';
import Home from './components/pages/Home';
import Navbar from './components/Navbar';
function App() {
  return (
    <Provider store={store}>
      <>
        <Navbar/>
        <Home/>
      </>
    </Provider>
  );
}

export default App;
