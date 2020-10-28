import { combineReducers } from 'redux';
import dogReducer from './dogReducer';
import peopleReducer from './peopleReducer';
import authReducer from './authReducer';
import demoReducer from './demoReducer';

export default combineReducers({
  dog: dogReducer,
  people: peopleReducer,
  auth: authReducer,
  demo: demoReducer,
})