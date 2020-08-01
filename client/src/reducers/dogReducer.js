import { GET_DOGS } from '../actions/types';

const initialState = {
  dogs: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_DOGS:
      return {
        ...state,
        dogs: action.payload,
      }
    default:
      return state;
  }
}