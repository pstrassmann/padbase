import React from 'react';
import './App.scss';
import { Provider } from 'react-redux';
import store from './store';
import Home from './components/pages/Home';
import HomeDogCards from './components/HomeDogCards';
function App() {
  return (
    <Provider store={store}>
      <>
        <Home/>
      </>
    </Provider>
  );
}

export default App;
