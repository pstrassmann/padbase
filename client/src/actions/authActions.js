import { SET_IS_AUTHENTICATED } from './types';

export const setIsAuthenticated = (isAuthenticated) => (dispatch) => {
  dispatch({
    type: SET_IS_AUTHENTICATED,
    payload: isAuthenticated,
  })
}