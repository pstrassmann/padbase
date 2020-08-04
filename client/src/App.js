import React from 'react';
import './App.scss';
import { Provider } from 'react-redux';
import AllDogs from './components/AllDogs';
import store from './store';

function App() {
  return (
    <Provider store={store}>
      <>
        <AllDogs/>
      </>
    </Provider>
  );
}

export default App;
