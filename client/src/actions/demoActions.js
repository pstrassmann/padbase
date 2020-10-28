import { SET_IN_DEMO_MODE } from './types';

export const setInDemoMode = (inDemoMode) => (dispatch) => {
  dispatch({
    type: SET_IN_DEMO_MODE,
    payload: inDemoMode,
  })
}