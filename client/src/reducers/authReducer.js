import {
  SET_IS_AUTHENTICATED
} from '../actions/types';

const initialState = {
  loading: true,
  isAuthenticated: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_IS_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: action.payload,
        loading: false,
      };
    default:
      return state;
  }
}