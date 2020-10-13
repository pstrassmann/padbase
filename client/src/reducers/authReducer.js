import {
  SET_IS_AUTHENTICATED, SET_UNAUTHORIZED_EMAIL
} from '../actions/types';

const initialState = {
  loading: true,
  isAuthenticated: false,
  unauthorizedEmail: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_IS_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: action.payload,
        loading: false,
      };
    case SET_UNAUTHORIZED_EMAIL:
      return {
        ...state,
        unauthorizedEmail: action.payload,
      };
    default:
      return state;
  }
}