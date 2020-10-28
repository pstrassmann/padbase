import { SET_IN_DEMO_MODE } from '../actions/types';

const initialState = {
  inDemoMode: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_IN_DEMO_MODE:
      return {
        ...state,
        inDemoMode: action.payload,
      }
    default:
      return state;
  }
}