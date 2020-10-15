import {
  SET_CURRENT_USER,
  SET_IS_AUTHENTICATED, SET_UNAUTHORIZED_EMAIL
} from '../actions/types';

const initialState = {
  loading: true,
  user: {
    isAuthenticated: false,
    unauthorizedEmail: null
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_IS_AUTHENTICATED:
      return {
        ...state,
        user: {
          ...state.user,
          isAuthenticated: action.payload,
          loading: false,
        }
      };
    case SET_UNAUTHORIZED_EMAIL:
      return {
        ...state,
        user: {
          ...state.user,
          unauthorizedEmail: action.payload,
        }
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        loading: false,
        user: {
          ...state.user,
          ...action.payload
        }
      };
    default:
      return state;
  }
}