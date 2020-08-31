import { combineReducers } from 'redux';
import dogReducer from './dogReducer';
import peopleReducer from './peopleReducer';

export default combineReducers({
  dog: dogReducer,
  people: peopleReducer,
})